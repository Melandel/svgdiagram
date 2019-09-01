capitalizeFirstLetter = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

override = function(defaultObj, overridingProps) {
	let mergedObject = {};
	for (let prop in defaultObj)
		mergedObject[prop] = defaultObj[prop];
	for (let prop in overridingProps)
		mergedObject[prop] = overridingProps[prop];
	
	return mergedObject;
}