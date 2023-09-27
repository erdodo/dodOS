import {get_data, set_data} from '../db'
export default async function handler (req:any, res:any) {
    const id = req.query.id;
    let datas ={}
    await get_data(req.query.collection,[{key:"id",if:"==",value:id}]).then(async(data)=>{
        datas = data
        datas= {
            ...req.body,
        }
        await set_data(req.query.collection,req.query.id,datas).then((data:any)=>{
            res.status(200).json(data)
        }).catch(err=>{
            res.status(400).json({error:err, message:"Error getting data"})
        })
    })

}

