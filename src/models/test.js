var fs = require('fs');


// const filePath = '/path/to/your/file.txt';


// console.log(__dirname.replace('src\\models', '') + 'local.rules'); // In ra thư mục gốc của đường dẫn
function foo() {
    console.log("foo")
}
function far() {
    console.log("far")
    foo()
}
far()

filePathRead = __dirname.replace('src\\models', '') + 'local.rules'
read = []
try {
    const fileData = fs.readFileSync(filePathRead, 'utf8');
    const lines = fileData.split('\n');
    const jsonData = []

    for (let i = 0; i < lines.length - 1; i++) {

        let ruleJson = {
            id: i,
            info: lines[i]
        }
        const dataObject = JSON.stringify(ruleJson);
        jsonData.push(dataObject);
    }
    read = jsonData
    // console.log(jsonData)
} catch (err) {
    console.error('Error reading file:', err);
}



// a = [
//     '{"id":0,"info":"alert icmp any any -> $HOME_NET any (msg:\\"ICMP test\\"; sid:10000001; rev:001;)"}',
//     '{"id":1,"info":"alert icmp any any -> $HOME_NET any (msg:\\"ICMP test\\"; sid:10000001; rev:001;)"}'
// ]



const filePathWrite = '../../write.rules';
const infoArray = [];

read.forEach(item => {
    const obj = JSON.parse(item);
    const info = obj.info;
    infoArray.push(info);
});
const fileContent = infoArray.join('\n') + "\n";
console.log(typeof fileContent)

fs.writeFileSync(filePathWrite, fileContent, (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data has been written to file successfully!');
    }
});