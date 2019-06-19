var mysql = require("Mysql");
var express = require("express");
var bodyparser = require("body-parser");
var app = express();
var details = require("./sqlQueries");
const { Parser } = require('json2csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    header: ['acc_no', 'first_name', 'last_name', 'dob', 'age', 'acc_type', 'status'],
    path: 'C:\\Users\\Parth Rastogi\\Desktop\\Internship stuff\\Project1\\src\\BankMember.csv'
});

const fields = ['acc_no', 'first_name', 'last_name', 'dob', 'age', 'acc_type', 'status']

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "project1"

    });


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");

    con.query("select * from personal_details", function (err, result, field) {
        // console.log(result);
        //    let personalDetails= [result];
        let json2csvParser = new Parser({ fields });
        let csver = json2csvParser.parse(result);
        console.log(csver);

        csvWriter.writeRecords(result)       // returns a promise
            .then(() => {
                console.log('...Done')
                    
            }).catch(function (err) {
                console.log(err)
            });;
    });

    app.get("/getall", function (req, res, next) {
        let fetAllPersonQuery = details.getAllPersonDetails()
        con.query(fetAllPersonQuery, function (err, result, field) {
            res.send(result);
        });
    });

    app.get("/getbyid/:tagId", function (req, res, next) {

        let getByIdQuery = details.getByIdDetails(req);

        con.query(getByIdQuery, function (err, result, field) {
            res.send(result);
        });
    });



    app.put("/updateinfobalance/:tagId", function (req, res, next) {
        let updateByIdQuery = details.updateByIdDetails(req);
        con.query(updateByIdQuery, function (err, result, next) {
            if (err) throw err;
            res.send("Succesfully updated");
        });
    });

    app.put("/inert/:tagId", function (req, res, next) {
        let delQuery = details.delDetails(req);
        con.query(delQuery, function (err, result, next) {
            if (err) throw err;
            res.send("Succesfully removed");
        });

    });

    app.post("/createAccount", function (req, res, next) {
        let createAccountBalanceQuery = details.createAccountBalanceDetails(req);
        let createAccountQuery = details.createAccountDetails(req);
        con.query(createAccountQuery, function (err, result, next) {
            if (err) throw err;
            con.query(createAccountBalanceQuery, function (err, result, next) {
                if (err) throw err;
                res.send("Succesfully Added into Account");
            });
        });


    });


    /*    app.post("/createAccountBalance",function(req,res,next)
        {
            let createAccountBalanceQuery=details.createAccountBalanceDetails(req);
            con.query(createAccountBalanceQuery,function(err,result,next)
            {
                 if(err) throw err;
                res.send("Succesfully Added into Account");
            });
        });*/


    // function(req,res,next){
    /*
                app.post("/createAccount",function(req,res,next)
                {
                    let createAccountBalanceQuery=details.createAccountBalanceDetails(req);
                    con.query(createAccountBalanceQuery,function(err,result,next)
                    {
                         if(err) throw err;
                        res.send("Succesfully Added into Account");
                    });
                });*/
    //});

});

app.listen(6000, function () {
    console.log("Server running on port 6000");
});

/*
        app.delete("/delbyid/:tagId",function(req,res,next){
            con.query("delete from personal_details where acc_no="+req.params.tagId,function(err,result,field)
            {
                if(err) throw err;
                res.send("Deleted from personal_details");
            });
           /* con.query("delete from acc_details where acc_no="+req.params.tagId,function(err,result,field)
            {
                if(err) throw err;
                res.send("Deleted from acc_details");
            });*/
       // });



/*
app.put("/updateinfolast",function(req,res,next){
    con.query("update personal_details set last_name="+req.body.last_name+"where acc_no="+req.body.acc_no,function(err,result,next){
        if(err) throw err;
        res.send("Succesfully updated")
    });
});*/