import translateError from "@/utils/mongodb.helper";
import userModel from '../user/user.model';
import IUser from '../user/user.interface';
import * as token from '@/utils/token'
import logger from '@/utils/logger';
import authModel from "./auth.model";
import { UserInfo } from "./auth.types";
import bcrypt from 'bcrypt'
import generateOtp from "@/utils/otp";
import sendMail from "@/services/zepto";
import moment from "moment";
import projectConfiguration from "../../server";

class AuthService {
  public async signup(firstname: string, password: string, email: string, lastname: string): Promise<{
    accessToken: string, refreshToken: string, user: UserInfo
  }> {
    try {
      if (!(await this.validatePasswordPolicy(password))) throw new Error('Password is not secure. Include at least one uppercase, lowercase, special character and number.')

      const verificationToken = generateOtp(5);

      const userInfo = await userModel.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password,
        verifyEmailToken: {
          token: await bcrypt.hash(verificationToken, 5),
          expires: moment(new Date()).add(5, "m").toDate()
        }
      })

      if (!userInfo) throw new Error('Unable to create your account. Please try again.')

      await sendMail("backbase-verify-email-otp", { email: userInfo.email, name: `${userInfo.firstname} ${userInfo.lastname}` }, "Welcome", {
        name: `${userInfo.firstname} ${userInfo.lastname}`,
        "OTP": verificationToken,
        "product_name": projectConfiguration.project.name
      })

      const accessToken = await token.generateToken(userInfo.id, true)
      const refreshToken = await token.generateToken(userInfo.id, false)

      // log session
      const authSession = await authModel.create({
        userId: userInfo.id,
        token: refreshToken,
      })

      return {
        accessToken,
        refreshToken,
        user: {
          firstname,
          lastname,
          email
        }
      };
    } catch (error) {
      logger(error)
      throw new Error(translateError(error)[0] || 'Unable to create your account. Please try again.')
    }
  }

  public async login(email: string, password: string): Promise<{
    accessToken: string, refreshToken: string, user: UserInfo
  }> {
    try {
      const user: IUser | null = await userModel.findOne({ email: email.toLowerCase() })

      if (!user) throw new Error('Incorrect email or password')

      const { firstname, lastname, isEmailVerified, photo } = user

      if (!user.isEmailVerified) throw new Error("Please verify your email.")

      if (!(await user.isValidPassword(password))) throw new Error('Incorrect email or password')

      // End user's existing session, if any
      await authModel.deleteOne({ userId: user.id })

      const accessToken = await token.generateToken(user.id, true)
      const refreshToken = await token.generateToken(user.id, false)

      // Log new user session
      const authSession = await authModel.create({
        userId: user.id,
        token: refreshToken,
      })

      logger(authSession)

      return {
        accessToken,
        refreshToken,
        user: {
          firstname,
          lastname,
          email,
          photo,
          isEmailVerified
        }
      }

    } catch (error: any) {
      logger(error)
      throw new Error(translateError(error)[0] || 'Incorrect email or password.')
    }

  }

  public async verifyEmail(token: string, email: string): Promise<void> {
    try {
      const user = await userModel.findOne({ email: email.toLowerCase() });

      if (!user) throw new Error("Account does not exist.");

      if (user.isEmailVerified) return;

      if (!(await bcrypt.compare(token, user.verifyEmailToken.token)) || Date.now() > new Date(user.verifyEmailToken.expires).getTime()) throw new Error("Invalid or expired token. Please try again.")

      const updatedUser = await userModel.findOneAndUpdate({
        email: email.toLowerCase()
      }, {
        isEmailVerified: true
      }, { new: true })

      if (!updatedUser) throw new Error("Unable to verify your account. Please try again.")
    } catch (error: any) {
      logger(error)
      throw new Error(error || 'Incorrect email or password.')
    }
  }

  public async requestEmailVerification(email: string): Promise<void> {
    try {
      const user = await userModel.findOne({
        email: email.toLowerCase(),
      })

      // user does not exist or account has already being verified. I return false to mislead possible attackers that may use this endpoint to verify if certain emails exist on the platform.
      if (!user || user.isEmailVerified) return;

      const verificationToken = generateOtp(5);

      const updatedUser = await userModel.findOneAndUpdate(
        {
          email: email.toLowerCase()
        }, {
        verifyEmailToken: {
          token: await bcrypt.hash(verificationToken, 5),
          expires: moment(new Date()).add(5, "m").toDate()
        }
      }, { new: true }
      )

      if (!updatedUser) throw new Error("Unable to send verification otp.")

      await sendMail("backbase-verify-email-otp", { email: user.email, name: `${user.firstname} ${user.lastname}` }, "Welcome", {
        name: `${user.firstname} ${user.lastname}`,
        "OTP": verificationToken,
        "product_name": projectConfiguration.project.name
      })
    } catch (error: any) {
      logger(error)
      throw new Error(error || 'Unable to send verification otp.')
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      const user = await userModel.findOne({ email: email.toLowerCase() })

      if (!user) return;

      const verificationToken = generateOtp(5);

      const updateUser = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, {
        forgotPasswordToken: {
          token: await bcrypt.hash(verificationToken, 5),
          expires: moment(new Date()).add(5, "m").toDate()
        }
      }, { new: true })

      if (!updateUser) throw new Error("Unable to send reset password token.")

      await sendMail("backbase-password-reset-otp", { email: user.email, name: `${user.firstname} ${user.lastname}` }, "Password Reset OTP", {
        name: `${user.firstname} ${user.lastname}`,
        "OTP": verificationToken,
        "product_name": projectConfiguration.project.name
      })
    } catch (error: any) {
      logger(error)
      throw new Error(error || 'Unable to send reset password token.')
    }
  }

  public async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    try {
      const user = await userModel.findOne({ email: email.toLowerCase() });

      if (!user) throw new Error("Account does not exist.");

      if (!(await bcrypt.compare(token, user.forgotPasswordToken.token)) || Date.now() > new Date(user.forgotPasswordToken.expires).getTime()) throw new Error("Invalid or expired token. Please try again.")

      const updatedUser = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, {
        password: await bcrypt.hash(newPassword, 10)
      }, { new: true })

      if(!updatedUser) throw new Error("Unable to rest password. Please try again.")

    } catch (error: any) {
      logger(error)
      throw new Error(error || 'Unable to send reset password token.')
    }
  }

  /**
       * Method to validate user password against password policy.
       *
       * Password Policy: Password must be minimum length of 8 and maximum of 64,
       * password should contain at least one valid special character, uppercase letter, lowercase letter and digit.
       */
  private async validatePasswordPolicy(password: string): Promise<Boolean> {
    try {

      const REQUIRED_CHARACTER_CLASSES = 4;

      const characterClasses: Record<string, RegExp> = {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        digit: /\d/,
        special: /[^\w\s]/,
      };

      let count = 0;

      for (const [name, regex] of Object.entries(characterClasses)) {
        if (regex.test(password)) {
          count += 1;
        }
      }

      if (count < REQUIRED_CHARACTER_CLASSES) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error(
        translateError(error)[0] || "Unable to validate password security"
      );
    }
  }


}

export default AuthService