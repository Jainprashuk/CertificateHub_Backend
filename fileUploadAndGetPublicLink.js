const bucket=require('./firebaseConfig.js');

const upload=async()=>{
  const file='./Picture1.png';
  const data=await bucket.upload(file,{
    metadata:{
      metadata:{
        userEmail:"userEmail1@gmail.com"
      }
    }
  });
  console.log(`${file} uploaded to ${data[0].metadata.mediaLink}`);
}

// upload();
var userFiles=[];
const getFilesByUserEmail=async()=>{
  const userEmail="userEmail1@gmail.com"
  const [files]=await bucket.getFiles()
  userFiles=files.filter(file=>file.metadata.metadata.userEmail===userEmail)
  userFiles.forEach(file=>{
    console.log(`File: ${file.name}`)
    console.log(`Link: ${file.metadata.mediaLink}`)
  })
}
getFilesByUserEmail();

const generatePulicLink=async()=>{
  await getFilesByUserEmail();
  const filenames=userFiles.map(file=>file.name)
  const [publicLinks]=await bucket.files[filenames[0]].getSignedUrl({
    action:'read',
    expires:'03-17-2025'
  })
  console.log(`Public link: ${publicLinks}`)  
}
generatePulicLink();