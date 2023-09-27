import {get_data} from '../db'
export default async function handler (req:any, res:any) {
    const filters = req.body?.filters ? req.body.filters:[];
    const orFilters = req.body?.orFilters ? req.body.orFilters:[];
    const order = req.query?.order ? req.query.order:"";
    const orderDesc = req.query?.orderDesc ? req.query.orderDesc:false;
    const limit = req.query?.limit ? req.query.limit:10;

   get_data(req.query.collection,filters,orFilters,order,orderDesc,limit).then((data:any)=>{
        res.status(200).json(data)
   }).catch(err=>{
       res.status(400).json({error:err, message:"Error getting data"})
   })
}

