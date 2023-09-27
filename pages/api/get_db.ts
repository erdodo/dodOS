import {get_data} from '../db'
export default async function handler (req:any, res:any) {

   get_data(req.query.collection,req.query.document).then((data:any)=>{
        res.status(200).json(data)
   })
}

