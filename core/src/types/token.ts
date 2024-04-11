import { ObjectId } from "mongodb"

type Token = {
    exp: number;
    id: ObjectId;
}

export default Token;