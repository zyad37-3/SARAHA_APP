
import { Messagemodel } from '../../db/model/message.model.js';
import * as base from './db.respository.js'

export const findById = async ({
  id,
  options,

}) => {
  return await base.findById({ id, options, model: Messagemodel });
}

export const findOne = async ({
  filter,
  options,

} = {}) => {
  return await base.findOne({ filter, options, model: Messagemodel });
}

export const find = async ({
  filter,
  options,
} = {}) => {
  return await base.find({ filter, options, model: Messagemodel });
}

/////////////////////////
export const paginate = async ({
  filter = {},
  options = {},
  select,
  page = "all",
  size = 5,
} = {}) => {
  return await base.paginate({ filter, select, page, size, options, model: Messagemodel })
}
/////////////////////////
export const create = async ({
  data,
  options,

}) => {

  return await base.create({ options, data, model: Messagemodel });
}

export const insertMany = async ({
  data,
}) => {
  return await base.insertMany({ data, model: Messagemodel })
}
////////////////////
export const updateOne = async ({
  filter,
  update,
  options,


} = {}) => {


  return await base.updateOne({ filter, update, options, model: Messagemodel })
}

export const findOneAndUpdate = async ({
  filter,
  update,
  options,


} = {}) => {
  return await base.findOneAndUpdate({ filter, update, options, model: Messagemodel })
}

export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
}) => {
  return await base.findByIdAndUpdate({ id, update, options, model: Messagemodel })
}
////////////////////
export const deleteOne = async ({
  filter,
}) => {
  return await base.deleteOne({ filter, model: Messagemodel })
}

export const deleteMany = async ({
  filter,
}) => {
  return await base.deleteMany({ filter, model: Messagemodel })
}

export const findOneAndDelete = async ({
  filter,
} = {}) => {
  return await base.findOneAndDelete({ filter, model: Messagemodel })
}
//////////////////////
export const countDocument = async ({
  filter,

} = {}) => {
  return await base.countDocument({ filter, model: Messagemodel })

}

export const pagination = async ({
  filter,
  options,
  page = 1,
  limit = 5

} = {}) => {
  return await base.pagination({ options, page, limit, filter, model: Messagemodel })
}
