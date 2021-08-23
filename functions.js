module.exports = {
    hasAllEle: function(arr, ele = []) {
       let hasAll = true
       
       for (let i = 0; i < ele.length; i++) {
          if (typeof arr[ele[i]] === 'undefined') {
             hasAll = false
             break
          }
       }
       return hasAll
    }
  }