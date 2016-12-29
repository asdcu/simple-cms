/**
 * Created by asd on 2016/12/27.
 */

module.exports = {

    //时间戳转换为日期格式
    timestampToTime: function(timestamp){
        var now = new Date(timestamp);
        var thisYear = now.getFullYear(),
            thisMonth = now.getMonth() + 1,
            thisDay = now.getDate(),
            thisHour = now.getHours(),
            thisMinute = now.getMinutes(),
            thisSecond = now.getSeconds();
        return thisYear + '-' + thisMonth + '-' + thisDay + ' ' + thisHour + ':' + thisMinute + ':' + thisSecond;
    }
};