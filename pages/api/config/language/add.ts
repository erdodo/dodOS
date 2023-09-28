import {get_data, set_data} from '../../db'
export default async function handler (req:any, res:any) {

    const filters =[
        {key:"lang",if:"==",value:req.query.lang},
    ]
    get_data("language",filters).then((data:any)=>{
        let datas:any = {}
        Object.keys(data[0]._fieldsProto).map((key)=>{
            datas[key] = data[0]._fieldsProto[key].stringValue
        })
        Object.keys(req.body).map((key)=>{
            datas[key] = req.body[key]
        })
        set_data("language",req.query.lang,datas).then((data:any)=>{
            res.status(200).json(data)
        }).catch(err=>{
            res.status(400).json({error:err, message:"Error getting data"})
        })

    }).catch(err=>{
        res.status(400).json({error:err, message:"Error getting data"})
    })

}

