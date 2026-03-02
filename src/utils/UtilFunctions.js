

const FilterObj=(allowedKeys,reqObj)=>{
     const filteredObj={}
    Object.keys(reqObj).forEach(key => {
        if(allowedKeys.includes(key)){
            filteredObj[key]=reqObj[key];
        }
    });
    return filteredObj;
};

const convertResponseObj = (dataObj={}, isSuccessfulReq, message = "") => {
     return {
        success: isSuccessfulReq,
        message: message,
        data: dataObj
    };
};

module.exports = {FilterObj, convertResponseObj};