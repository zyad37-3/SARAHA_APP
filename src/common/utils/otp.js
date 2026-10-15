export const creatOtp=()=>{
  return Math.floor(Math.random() * (1000000 - 100000) + 100000);
}
