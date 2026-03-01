

const FilterObj=(allowedKeys,reqObj)=>{
     const filteredObj={}
    Object.keys(reqObj).forEach(key => {
        if(allowedKeys.includes(key)){
            filteredObj[key]=reqObj[key];
        }
    });
    return filteredObj;
};

module.exports = {FilterObj};