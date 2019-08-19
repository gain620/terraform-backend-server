const fs = require('fs');

// var currentThis = this;

async function add(one, two) {
    // console.log(this);
    var currentThis = this;
    var a;
    testTime = setTimeout(() => {
        a = one;
        console.log(a);
        console.log(one);
    }, 5000);
    // console.log(a);

    // console.log(a);
    await testTime;
    return 50 + a + two;
}

const path = './config.txt';

fs.access(path, fs.F_OK, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  // file exists
  fs.readFile(path, (err, data) => {
    console.log(data.toString());
    fs.writeFile(path, 'This is a file write test456', (err, data) => {
        if(err) {
            console.log(err);
        }
      });
  });

  
});

// add(50,55).then(res => {
//     console.log(res);
// });