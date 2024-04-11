import axios from "axios";
import * as yaml from 'js-yaml';
import fs from 'fs';
import logger from "@/utils/logger";

const url = "https://api.zeptomail.com/v1.1/email/template";
const token = process.env.ZEMPTO_TOKEN

const sendMail = async (templateAlias: string, receiver: { email: string, name: string }, subject: string, mergeInfo: any): Promise<any> => {
    try {
        const response = await axios({
            url: 'https://api.zeptomail.ca/v1.1/email/template',
            method: 'POST',
            data: {
                template_alias: templateAlias,
                from:
                {
                    address: `${mergeInfo.product_name.toLowerCase()}.backbase@mosope.link`,
                    name: `${mergeInfo.product_name}`
                },
                to:
                    [
                        {
                            email_address:
                            {
                                address: receiver.email,
                                name: receiver.name
                            }
                        }
                    ],
                merge_info: mergeInfo,
                subject
            },
            headers: {
                Authorization: process.env.ZEMPTO_TOKEN,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        console.log(response.data)
        return response.data
    } catch (error: any) {
        console.log(error?.response?.data.error)
        throw new Error("Unable to send invite mail. Please try again")
    }
}

export default sendMail