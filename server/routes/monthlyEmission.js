const router = require('express').Router();
const { model } = require('mongoose');
let monthlyEmission = require('../models/monthlyEmission.model');
const cors = require('cors');

router.use(cors());

router.post('/getmonthly',async(req,res)=>
{
    try{
     const Id = req.body.uid;
     const todayEmission = await monthlyEmission.find({uid:Id})
     res.send(todayEmission)
    }
    catch(e){
        console.log(e)
    }
});

router.post('/monthly',async(req,res)=>
{
    
    try{
        console.log('hi')
    const help=req.body
    const d=new Date
    const monthh=d.getMonth()+1;
    let obj={
        uid:help.uid,
        gas:help.gas,
        flights:Number(help.flights),
        electricity: Number(help.electricity),
        total: help.total,
        month:monthh
    }
    console.log(obj);
    const newMonth =await  monthlyEmission.findOne({month:obj.month,uid:obj.uid})
    if(newMonth)
    {
      if( obj.electricity && obj.electricity!=NaN )
      newMonth.electricity +=obj.electricity;
      if(obj.flights && obj.flights!=NaN )
      newMonth.flights +=obj.flights;
      if(obj.total && obj.total!=NaN)
      newMonth.total +=obj.total;
        console.log(newMonth)
      await newMonth.save();
      res.send("more emission for this month")
    }
    else{
      const newMonthEmission = await new monthlyEmission(obj)
      await newMonthEmission.save()
      res.send("New month, new emission")
    }
    }
    catch(e){
console.log(e)
    }
})

module.exports = router;