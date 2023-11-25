function JSDatetimeToMySQLDatetime(date){
    let dateString = date.toLocaleDateString();
    let timeString = date.toLocaleTimeString();

    function convertTime(time){
        let timeFraction = time.split(" ");
        let noon = timeFraction[1]
        if (noon==="AM"){
            return timeFraction[0]
        }else{
            let hour = timeFraction[0].split(":")
            let a = Number(hour[0]) + 12
            return a + ":" + hour[1] + ":" + hour[2]
        }
    }
    
    function convertDate(date){
        let dateSplit = date.split("/");
        return dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1]
    }

    return convertDate(dateString) + " " + convertTime(timeString)
}

export default JSDatetimeToMySQLDatetime;