import {delete_data} from '../db'
export default async function handler (req:any, res:any) {

         delete_data(req.query.collection,req.query.id).then((data:any)=>{
            res.status(200).json(data)
        }).catch(err=>{
            res.status(400).json({error:err, message:"Error getting data"})
        })


}


