function find(arr, fun) {
  for (var i = 0; i < arr.length; i++) {
    if (fun(arr[i])) return arr[i];
  }
}
function memoize(fun) {
  var memos = [];
  return function(a, b) {
    var memo = find(memos, function(memo) {
      return memo.a === a && memo.b === b;
    });
    if (memo) return memo.val;
    memos.push({
      a: a,
      b: b,
      val: fun(a, b)
    });
    return memos[memos.length - 1].val;
  };
}

var matchVarToken = /\{\{(\w*?)\}\}/;


function addLd(increment, ftm) {
  var newFtm = Object.create(ftm);
  newFtm.ld = ftm.ld + increment;
  return newFtm;
}

function setVarRange(vName, idx, ftm) {
  var newFtm = Object.create(ftm);
  var vFound = false;
  newFtm.vars = ftm.vars.map(function(v) {
    if (v.vName !== vName) return v;
    vFound = true;
    return {
      vName: vName,
      start: v.start,
      end: idx
    };
  });
  if (!vFound) {
    newFtm.vars.push({
      vName: vName,
      start: idx - 1,
      end: idx
    });
  }
  return newFtm;
}

function startVarRange(vName, idx, ftm) {
  var newFtm = Object.create(ftm);
  newFtm.vars = ftm.vars.map(function(v) {
    return (v);
  });
  newFtm.vars.push({
    vName: vName,
    start: idx,
    end: idx
  });
  return newFtm;
}

function fuzzyTemplateMatch(stringyString, templateString) {
  //Replace all the variables with single characters,
  //and map the locations of those characters to the variable names.
  var offsetMap = [];
  var vReplaced = true;
  while (vReplaced) {
    vReplaced = false;
    templateString = templateString.replace(matchVarToken, function(match, vName, offset) {
      offsetMap.push({
        offset: offset,
        vName: vName
      });
      vReplaced = true;
      return '*';
    });
  }

  var ftmRecurse = memoize(function(lenA, lenB) {
    var result = {
      vars: []
    };
    if (lenA === 0) {
      result.ld = lenB;
      result.vars = offsetMap.filter(function(x) {
        return x.offset < lenB;
      }).map(function(x) {
        return {
          vName: x.vName,
          start: 0,
          end: 0
        };
      });
      return result;
    }
    if (lenB === 0) {
      result.ld = lenA;
      return result;
    }
    var pftms = [];

    var vAtOffset = find(offsetMap, function(x) {
      return x.offset === (lenB - 1);
    });

    if (vAtOffset) {
      pftms.push(setVarRange(vAtOffset.vName, lenA, addLd(0.99, ftmRecurse(lenA - 1, lenB))));
      pftms.push(setVarRange(vAtOffset.vName, lenA, addLd(0.99, ftmRecurse(lenA - 1, lenB - 1))));
      pftms.push(startVarRange(vAtOffset.vName, lenA, addLd(1, ftmRecurse(lenA, lenB - 1))));
    }
    else {
      pftms.push(addLd(1, ftmRecurse(lenA, lenB - 1)));
      pftms.push(addLd(1, ftmRecurse(lenA - 1, lenB)));
      if (stringyString[lenA - 1] === templateString[lenB - 1]) {
        pftms.push(ftmRecurse(lenA - 1, lenB - 1));
      }
      else {
        pftms.push(addLd(2, ftmRecurse(lenA - 1, lenB - 1)));
      }
    }


    return pftms.reduce(function(minSoFar, pftm) {
      if (!minSoFar) return pftm;
      if (pftm.ld < minSoFar.ld) {
        return pftm;
      }
      else {
        return minSoFar;
      }
    });
  });
  return ftmRecurse(stringyString.length, templateString.length);
}