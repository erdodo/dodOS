import {get_doc} from '../../../db'
export default async function handler (req:any, res:any) {

    get_doc("language","langs").then((data:any)=>{
        let datas:any = data["_fieldsProto"]

        Object.keys(datas).map((key)=>{
            const newDatas = datas[key].mapValue.fields
            Object.keys(newDatas).map((key2)=>{
                datas[key][key2] = newDatas[key2].stringValue
            })
            delete datas[key].mapValue
            delete datas[key].valueType
        })

        res.status(200).json(datas)
    }).catch(err=>{
        res.status(400).json({error:err, message:"Error getting data"})
    })
}

