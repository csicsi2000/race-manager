export function formatMs(ms: number) {
  if(!ms){
    return "Error"
  }
  let textMillis = String(ms);
  let remainingMillis = textMillis.substring(textMillis.length-3);
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
    return (

      (minutes == 0 ? "" : minutes + ":") + (seconds < 10 && minutes !=0 ? "0" : "")+ seconds +"."+ remainingMillis
    );
  }

export function formatDate(date: Date):string{
  if(typeof(date) == "string"){
    date = new Date(date);
  }
  let formattedDate = date.toLocaleString("hu-HU")
  console.log(formattedDate);
  return formattedDate;
}