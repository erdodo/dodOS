import {get_doc} from '../../db'
export default async function handler (req:any, res:any) {

    get_doc("language",req.query.lang).then((data:any)=>{
        let datas:any = {}
        Object.keys(data[0]._fieldsProto).map((key)=>{
            datas[key] = data[0]._fieldsProto[key].stringValue
        })
        res.status(200).json(datas)
    }).catch(err=>{
        res.status(400).json({error:err, message:"Error getting data"})
    })
}

