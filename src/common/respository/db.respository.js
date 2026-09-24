// export const create = async ({
//     model,
//     option = {},
//     filter = {}
// }) => {
//     return await model.create(filter, option)
// }

// export const findOne = async ({
//     model,
//     option = {},
//     filter = {},

// }) => {
//     const doc = model.findOne(filter)
//     if (option.populate) {
//         doc.populate(option.populate)
//     }
//     if (option.select) {
//         doc.select(option.select)
//     }
//     if (option.lean) {
//         doc.lean()
//     }
//     return await doc.exec()
// }
// export const findOneAndUpdate = async ({
//     model,
//     options,
//     filter,
//     update

// }) => {


//     return await model.findOneAndUpdate(filter || {},
//         { ...update, $inc: { __v: 1 } },
//         { new: true, runValidators:true, ...options })
// }
// export const findByIdAndUpdate = async ({
//     model,
//     options={new:true},
//     filter,
//     update,
//     id

// }) => {


//     return await model.findByIdAndUpdate(
//         id,
//         filter || {},
//         { ...update, $inc: { __v: 1 } },
//         options )
// }


// export const insertMany = async ({
//     model,
//     data
// }) => {
//     return await model.insertMany(data)
// }


// export const updateOne = async ({
//     model,
//     options,
//     filter,
//     update

// }) => {


//     return await model.updateOne(filter || {}, { ...update, $inc: { __v: 1 } }, options)
// }


// export const deleteOne = async ({
//     model,
  
//     filter

// }) => {


//     return await model.deleteOne(filter || {})
// }
// export const deleteMany = async ({
//     model,
//     filter

// }) => {


//     return await model.deleteMany(filter || {})
// }
// export const findOneAndDelete = async ({
//     model,
//     filter

// }) => {


//     return await model.findOneAndDelete(filter || {})
// }




export const findById = async ({
  id,
  options,
  model
}) => {
  const doc = model.findById(id);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.select) {
    doc.select(options.select);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}

export const findOne = async ({
  filter,
  options,
  model
} = {}) => {
  const doc = model.findOne(filter);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.select) {
    doc.select(options.select);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}

export const find = async ({
  filter,
  options,
 
  model
} = {}) => {
  const doc = model.find(filter || {})
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.select) {
    doc.select(options.select);
  }
  if (options?.skip) {
    doc.skip(options.skip);
  }

  if (options?.limit) {
    doc.limit(options.limit);
  }

  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}

/////////////////////////
export const paginate = async ({
  filter = {},
  options = {},
  select,
  page = "all",
  size = 5,
  model

} = {}) => {
  let docsCount = undefined;
  let pages = undefined;
  if (page !== "all") {
    page = Math.floor(page < 1 ? 1 : page);
    options.limit = Math.floor(size < 1 || !size ? 5 : size);
    options.skip = (page - 1) * options.limit;

    docsCount = await model.countDocuments(filter);
    pages = Math.ceil(docsCount / options.limit);
  }
  const result = await find({ model, filter, select, options });
  return {
    docsCount,
    limit: options.limit,
    pages,
    currentPage: page !== "all" ? page : undefined,
    result,
  };
}
/////////////////////////
export const create = async ({
  data,
  options,
  model

}) => {
  console.log(data);
  
  return await model.create(data, options) || [];
}

export const insertMany = async ({
  data,
  model

}) => {
  return (await model.insertMany(data))
}
////////////////////
export const updateOne = async ({
  filter,
  update,
  options,
  model

} = {}) => {
  if (Array.isArray(update)) {
    update.push({
      $set: {
        __v: { $add: ["$__v", 1] },
      },
    });
    return await model.updateOne(filter || {}, update, { ...options, runValidators: true, updatePipeline: true });
  }

  return await model.updateOne(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    options
  );
}

export const findOneAndUpdate = async ({
  filter,
  update,
  options,
  model

} = {}) => {
  if (Array.isArray(update)) {
    update.push({
      $set: {
        __v: { $add: ["$__v", 1] },
      },
    });
    return await model.findOneAndUpdate(filter || {}, update, {
      new: true,
      runValidators: true,

      ...options,
      updatePipeline: true,
    }
    );
  }
  return await model.findOneAndUpdate(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    {
      new: true,
      runValidators: true,

      ...options,
    }
  );
}

export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
  model

}) => {
  return await model.findByIdAndUpdate(
    id,
    { ...update, $inc: { __v: 1 } },
    options
  );
}
////////////////////
export const deleteOne = async ({
  filter,
  model

}) => {
  return await model.deleteOne(filter || {});
}

export const deleteMany = async ({
  filter,
  model

}) => {
  return await model.deleteMany(filter || {});
}

export const findOneAndDelete = async ({
  filter,
  model

} = {}) => {
  return await model.findOneAndDelete(
    filter || {},
  );
}