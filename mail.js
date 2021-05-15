var nodemailer = require('nodemailer');
let cron = require('node-cron');
var fs = require('fs'); 
var parse = require('csv-parse');

console.log('Started...');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'sgac1001@gmail.com',
      pass: 'SampleGmailAccount@123'
    }
});


var csvData=[];
//Read data from CSV File
fs.createReadStream("./Sample.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        csvData.push(csvrow);  
      
        //To make sure that we are not using the table header line from CSV AND if msg is >1 & <=160
        if(csvrow[4]!="Schedule On" && csvrow[0].length>1 &&csvrow[0].length<=160){
          //set mail options using csv file for each mail
          var mailOptions = {
            from: 'sgac1001@gmail.com',
            to: csvrow[1],
            subject: 'Sending Email using Node.js',
            html: '<h1>Hi, How are you? </h1><p>I hope you are doing good!</p><p>The message is :'+csvrow[0]+ '</p><p>Sumanth Kubasad</p><p>SDMCET Dharwad</p>',
            text: 'I hope you are doing good!'
          };
  
          //Read date so that we can schedule a mail
          let day,month,year;
          if(csvrow[4]){
            day=csvrow[4].charAt(0) + csvrow[4].charAt(1);
            month=csvrow[4].charAt(3) + csvrow[4].charAt(4);
            year=csvrow[4].charAt(6) + csvrow[4].charAt(7);
          }
  
          let strparam = "0 0 0 0 0 *";
          //check if date exist
          if((day!="00" && month!="00" )){
            strparam = "0 0 0 "+day+" "+month+" *";

            //Schedule a mail 
            cron.schedule(strparam, () => {
              // Send mail
              transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      //Write error to Output.txt
                      let temp;
                      fs.readFile('Output.txt', 'utf8', function(err, data){
                        temp=data;
                        console.log(data);
                        fs.writeFile('Output.txt', data+" "+ error, (err) => {
                          if (err) throw err;
                        });
                      });
                    } else {
                      console.log('Email sent: ' + info.response);
                      let temp;
                      fs.readFile('Output.txt', 'utf8', function(err, data){
                        temp=data;
                        console.log(data);
                        fs.writeFile('Output.txt', data+" "+info.response, (err) => {
                          if (err) throw err;
                        });
                      });
                    }
                });
              }
            );
          }else{
            //Send mail immedietly
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                //Write error to Output.txt
                let temp;
                fs.readFile('Output.txt', 'utf8', function(err, data){
                  temp=data;
                  console.log(data);
                  fs.writeFile('Output.txt', data+" "+ error, (err) => {
                    if (err) throw err;
                  });
                });
              } else {
                console.log('Email sent: ' + info.response);
                //Write Success data to Output.txt
                let temp;
                fs.readFile('Output.txt', 'utf8', function(err, data){
                  temp=data;
                  console.log(data);
                  fs.writeFile('Output.txt', data+" "+info.response, (err) => {
                    if (err) throw err;
                  });
                });
              }
            });
          }
          
        }
        
    
    })
    .on('end',function() {
      console.log("csv file Data Received");
    });


//For Every 2 minutes a message Running is printed in the console to make sure the program is running
cron.schedule('0 */2 * * * *', () => {
  console.log('Running');
});

