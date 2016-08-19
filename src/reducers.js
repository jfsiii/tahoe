import { handleActions } from 'redux-actions'
import { Map, List, fromJS } from 'immutable'

const initialState = Map({
  subsets: Map()
})

// subset state
const createSubset = (state, { payload: { subset, fresh } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!fresh && state.hasIn(path)) return state
  const record = Map({
    id: subset,
    pending: true
  })
  return state.setIn(path, record)
}

const setSubsetData = (state, { meta: { subset }, payload: { raw } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  return state.updateIn(path, (subset) =>
    subset
      .set('data', fromJS(raw))
      .set('pending', false)
      .set('error', null)
  )
}

const setSubsetError = (state, { meta: { subset }, payload }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  return state.updateIn(path, (subset) =>
    subset
      .delete('data')
      .set('error', payload)
      .set('pending', false)
  )
}

const setSubsetOpen = (state, { meta: { subset, collection } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  return state.updateIn(path, (subset) =>
    subset
      .set('pending', false)
      .set('data', collection ? List() : Map())
  )
}

const insertSubsetDataItem = (state, { meta: { subset, collection }, payload: { raw } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  const newData = fromJS(raw)
  return state.updateIn(path, (subset) =>
    subset
      .set('pending', false)
      .update('data', (data) => {
        // first event, initialize the value
        if (data == null && collection) return List([ newData ])
        // value exists, either push or replace
        return collection ? data.push(newData) : newData
      })
  )
}

const updateSubsetDataItem = (state, { meta: { subset, collection }, payload: { raw } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  const dataPath = [ ...path, 'data' ]
  if (!state.hasIn(dataPath)) return state // subset has no data to update
  const next = fromJS(raw.next)
  return state.updateIn(dataPath, (data) => {
    // not a list item, replace with new value
    if (!collection) return next

    // list item, find the index and do the update
    const idx = data.findIndex((i) => i.get('id') === raw.prev.id)
    if (idx == null) return data // not our data?
    return data.set(idx, next)
  })
}
const deleteSubsetDataItem = (state, { meta: { subset, collection }, payload: { raw } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  const dataPath = [ ...path, 'data' ]
  if (!state.hasIn(dataPath)) return state // subset has no data to update

  // not a list, just wipe the val
  if (!collection) {
    return state.removeIn(dataPath)
  }
  // item in a list, remove the specific item
  return state.updateIn(dataPath, (data) => {
    const idx = data.findIndex((i) => i.get('id') === raw.id)
    if (idx == null) return data // not our data?
    return data.delete(idx)
  })
}

// exported actions
export const api = handleActions({
  'tahoe.request': createSubset,
  'tahoe.failure': setSubsetError,
  'tahoe.success': setSubsetData,
  'tahoe.tail.open': setSubsetOpen,
  'tahoe.tail.insert': insertSubsetDataItem,
  'tahoe.tail.update': updateSubsetDataItem,
  'tahoe.tail.delete': deleteSubsetDataItem
}, initialState)
