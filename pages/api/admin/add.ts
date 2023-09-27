import {set_data} from '../db'
import {v4 as uuid}  from 'uuid'
export default async function handler (req:any, res:any) {
    const id = uuid();
    const datas = {
        ...req.body,
        id: id,
        state:true,
        isDeleted:false
    }


    set_data(req.query.collection,id,datas).then((data:any)=>{
        res.status(200).json(data)
    }).catch(err=>{
        res.status(400).json({error:err, message:"Error getting data"})
    })
}

