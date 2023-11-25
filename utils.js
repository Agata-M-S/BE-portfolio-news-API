exports.paginate = (queryStr, page, limit) => {
  
	limit = +limit;
	page = +page;

	if (!limit || typeof limit != "number") {
		limit = 10;
	}
	if (!page || typeof limit != "number") {
		page = 1;
	}

	const offset = (page - 1) * limit;
	
	queryStr += ` LIMIT ${limit} OFFSET ${offset}`;

	return queryStr;
};
