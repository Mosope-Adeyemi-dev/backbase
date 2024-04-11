import axios from "axios";
import logger from "@/utils/logger";

const sendMail = async (templateAlias: string, receiver: { email: string, name: string }, subject: string, mergeInfo: any): Promise<any> => {
    try {
        const response = await axios({
            url: 'https://api.zeptomail.ca/v1.1/email/template',
            method: 'POST',
            data: {
                template_alias: templateAlias,
                from:
                {
                    address: process.env.ZEMPTO_MAIL,
                    name: "BackBase BaaS"
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

        logger(response.data)
        return response.data
    } catch (error: any) {
        logger(error?.response?.data.error)
        throw new Error("Unable to send invite mail. Please try again.")
    }
}

export default sendMail