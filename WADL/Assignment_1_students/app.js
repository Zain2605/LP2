const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./model');
const dbConfig = require('./config');
const { json } = require('express/lib/response');

var PORT = 3000;
var app = express();

app.set("view engine","ejs");   // for viewing
app.use(bodyParser.urlencoded({extended: true}));   // used for parsing url encoded bodies
app.use(bodyParser.json());     // used for parsing json data

mongoose.connect(dbConfig.url,{
    useNewUrlParser: true
}).then(()=>{
    console.log("Connected to the database");
}).catch((err)=>{
    console.log("Cannot connect to the database. Possible error => ",err);
    process.exit();
});

// form
app.get('/',(req,res)=>{
    //res.render("index");
    res.render("home");
});

app.get('/register',(req,res)=>{
    //res.render("index");
    res.render("index");
});

// add student
app.post('/addStudent',(req,res)=>{
    //res.render("index")
    var stud = new Student(req.body);
    stud.save().then(()=>res.json({"message": "Successfully saved"})).catch((err)=>{
        res.status(400).json({"error": err});
    });
});

// get all students and count
app.get('/students',(req,res)=>{
    var query = {};
    
    if(Object.keys(req.query).length != 0){
        var li = req.query['subject'].split(',').map(sub=>sub+"_Marks");
        var marks = parseInt(req.query['marks']);
        for(let i=0;i<li.length;i++){
            query[li[i]] = {$gt: marks};
        }
    }
    
    Student.find(query).count().then((c)=>{
        Student.find(query).then((student)=>{
            res.render("table",{student:student, count:c});
        })
    }).catch((err)=>res.json({"error":err}));
});



app.get('/dsbdamarksgt20', async (req,res)=>{
    //var query= await Student.find({DSBDA_Marks: {$gt:20}})
    var query= {DSBDA_Marks: {$gt:20}}
    //JSON.stringify(query)
    //res.render("table",{student:student, count:c})
    // console.log(JSON.stringify(query))
    // res.render("table",{student:student, count:c});

    Student.find(query).count().then((c)=>{
        Student.find(query).then((student)=>{
            res.render("table",{student:student, count:c});
        })
    }).catch((err)=>res.json({"error":err}));

});

app.get('/gt25allsub', async (req,res)=>{
    //var query= await Student.find({DSBDA_Marks: {$gt:20}})
    var query= {
        $and: [
            {
                WAD_Marks: {$gt: 25}
            },
            {
                DSBDA_Marks: {$gt: 25}
            },
            {
                CNS_Marks: {$gt: 25}
            },
            {
                CC_Marks: {$gt: 25}
            },
            {
                AI_Marks: {$gt: 25}
            },
        ]
    }
    

    Student.find(query).count().then((c)=>{
        Student.find(query).then((student)=>{
            res.render("table",{student:student, count:c});
        })
    }).catch((err)=>res.json({"error":err}));

});

app.get('/lt40', async (req,res)=>{
    //var query= await Student.find({DSBDA_Marks: {$gt:20}})
    var query= {$or: [
        {
            WAD_Marks: {$lt: 40}
        },
        {
            CC_Marks: {$lt: 40}
        },

    ]}
    //JSON.stringify(query)
    //res.render("table",{student:student, count:c})
    // console.log(JSON.stringify(query))
    // res.render("table",{student:student, count:c});

    Student.find(query).count().then((c)=>{
        Student.find(query).then((student)=>{
            res.render("table",{student:student, count:c});
        })
    }).catch((err)=>res.json({"error":err}));

});

// delete any student
app.post('/deleteStudent/:id',(req,res)=>{
    Student.findByIdAndDelete(req.params.id).then((student)=>{
        res.redirect('/students');
    }).catch((err)=>{
        res.json({"error": err});
    })
});

// update any student
app.get('/updateStudent',(req,res)=>{
    //res.render("update")
    var id = req.query['rollNo'];
    var marks = parseInt(req.query['marks']);
    Student.findOneAndUpdate({"Roll_No":id},{$inc:{"WAD_Marks":marks, "DSBDA_Marks":marks,"CC_Marks":marks,"CNS_Marks":marks,"AI_Marks":marks}}).then(()=>{
        res.redirect('/students');
    }).catch((err)=>{
        res.json({"error": err});
    });
});

app.listen(PORT,()=>{
    console.log("Listening");
})