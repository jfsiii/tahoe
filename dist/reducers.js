'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var toImmutable = function toImmutable(v) {
  return (0, _immutable.fromJS)(v, function (key, value) {
    return _immutable.Iterable.isIndexed(value) ? value.toList() : value.toOrderedMap();
  });
};

var initialState = (0, _immutable.OrderedMap)({
  subsets: (0, _immutable.OrderedMap)()
});

// subset state
var createSubset = function createSubset(state, _ref) {
  var _ref$payload = _ref.payload,
      subset = _ref$payload.subset,
      fresh = _ref$payload.fresh;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!fresh && state.hasIn(path)) return state;
  var record = (0, _immutable.OrderedMap)({
    id: subset,
    pending: true
  });
  return state.setIn(path, record);
};

var setSubsetData = function setSubsetData(state, _ref2) {
  var subset = _ref2.meta.subset,
      _ref2$payload = _ref2.payload,
      raw = _ref2$payload.raw,
      text = _ref2$payload.text;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  return state.updateIn(path, function (subset) {
    return subset.set('data', toImmutable(raw)).set('text', text).set('pending', false).set('error', null);
  });
};

var setSubsetError = function setSubsetError(state, _ref3) {
  var subset = _ref3.meta.subset,
      payload = _ref3.payload;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  return state.updateIn(path, function (subset) {
    return subset.delete('data').delete('text').set('error', payload).set('pending', false);
  });
};

var setSubsetOpen = function setSubsetOpen(state, _ref4) {
  var _ref4$meta = _ref4.meta,
      subset = _ref4$meta.subset,
      collection = _ref4$meta.collection;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  return state.updateIn(path, function (subset) {
    return subset.set('pending', false).set('data', collection ? (0, _immutable.List)() : (0, _immutable.OrderedMap)());
  });
};

var insertSubsetDataItem = function insertSubsetDataItem(state, _ref5) {
  var _ref5$meta = _ref5.meta,
      subset = _ref5$meta.subset,
      collection = _ref5$meta.collection,
      raw = _ref5.payload.raw;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  var newData = toImmutable(raw);
  return state.updateIn(path, function (subset) {
    return subset.set('pending', false).update('data', function (data) {
      // first event, initialize the value
      if (data == null && collection) return (0, _immutable.List)([newData]);
      // value exists, either push or replace
      return collection ? data.push(newData) : newData;
    });
  });
};

var updateSubsetDataItem = function updateSubsetDataItem(state, _ref6) {
  var _ref6$meta = _ref6.meta,
      subset = _ref6$meta.subset,
      collection = _ref6$meta.collection,
      raw = _ref6.payload.raw;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  var dataPath = [].concat(path, ['data']);
  if (!state.hasIn(dataPath)) return state; // subset has no data to update
  var next = toImmutable(raw.next);
  return state.updateIn(dataPath, function (data) {
    // not a list item, replace with new value
    if (!collection) return next;

    // list item, find the index and do the update
    var idx = data.findIndex(function (i) {
      return i.get('id') === raw.prev.id;
    });
    if (idx == null) return data; // not our data?
    return data.set(idx, next);
  });
};
var deleteSubsetDataItem = function deleteSubsetDataItem(state, _ref7) {
  var _ref7$meta = _ref7.meta,
      subset = _ref7$meta.subset,
      collection = _ref7$meta.collection,
      raw = _ref7.payload.raw;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  var dataPath = [].concat(path, ['data']);
  if (!state.hasIn(dataPath)) return state; // subset has no data to update

  // not a list, just wipe the val
  if (!collection) {
    return state.removeIn(dataPath);
  }
  // item in a list, remove the specific item
  return state.updateIn(dataPath, function (data) {
    var idx = data.findIndex(function (i) {
      return i.get('id') === raw.id;
    });
    if (idx == null) return data; // not our data?
    return data.delete(idx);
  });
};

// exported actions
var api = exports.api = (0, _reduxActions.handleActions)({
  'tahoe.request': createSubset,
  'tahoe.failure': setSubsetError,
  'tahoe.success': setSubsetData,
  'tahoe.tail.open': setSubsetOpen,
  'tahoe.tail.insert': insertSubsetDataItem,
  'tahoe.tail.update': updateSubsetDataItem,
  'tahoe.tail.delete': deleteSubsetDataItem
}, initialState);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWR1Y2Vycy5qcyJdLCJuYW1lcyI6WyJ0b0ltbXV0YWJsZSIsInYiLCJrZXkiLCJ2YWx1ZSIsIkl0ZXJhYmxlIiwiaXNJbmRleGVkIiwidG9MaXN0IiwidG9PcmRlcmVkTWFwIiwiaW5pdGlhbFN0YXRlIiwic3Vic2V0cyIsImNyZWF0ZVN1YnNldCIsInN0YXRlIiwicGF5bG9hZCIsInN1YnNldCIsImZyZXNoIiwicGF0aCIsImhhc0luIiwicmVjb3JkIiwiaWQiLCJwZW5kaW5nIiwic2V0SW4iLCJzZXRTdWJzZXREYXRhIiwibWV0YSIsInJhdyIsInRleHQiLCJ1cGRhdGVJbiIsInNldCIsInNldFN1YnNldEVycm9yIiwiZGVsZXRlIiwic2V0U3Vic2V0T3BlbiIsImNvbGxlY3Rpb24iLCJpbnNlcnRTdWJzZXREYXRhSXRlbSIsIm5ld0RhdGEiLCJ1cGRhdGUiLCJkYXRhIiwicHVzaCIsInVwZGF0ZVN1YnNldERhdGFJdGVtIiwiZGF0YVBhdGgiLCJuZXh0IiwiaWR4IiwiZmluZEluZGV4IiwiaSIsImdldCIsInByZXYiLCJkZWxldGVTdWJzZXREYXRhSXRlbSIsInJlbW92ZUluIiwiYXBpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUEsSUFBTUEsY0FBYyxTQUFkQSxXQUFjLENBQUNDLENBQUQ7QUFBQSxTQUNsQix1QkFBT0EsQ0FBUCxFQUFVLFVBQUNDLEdBQUQsRUFBTUMsS0FBTjtBQUFBLFdBQ1JDLG9CQUFTQyxTQUFULENBQW1CRixLQUFuQixJQUE0QkEsTUFBTUcsTUFBTixFQUE1QixHQUE2Q0gsTUFBTUksWUFBTixFQURyQztBQUFBLEdBQVYsQ0FEa0I7QUFBQSxDQUFwQjs7QUFLQSxJQUFNQyxlQUFlLDJCQUFXO0FBQzlCQyxXQUFTO0FBRHFCLENBQVgsQ0FBckI7O0FBSUE7QUFDQSxJQUFNQyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxRQUEyQztBQUFBLDBCQUFqQ0MsT0FBaUM7QUFBQSxNQUF0QkMs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LFNBQUYsRUFBYUYsTUFBYixDQUFiO0FBQ0EsTUFBSSxDQUFDRixNQUFNSyxLQUFOLENBQVlELElBQVosQ0FBTCxFQUF3QixPQUFPSixLQUFQLENBSGtFLENBR3JEO0FBQ3JDLE1BQU0wQixxQkFBZ0J0QixJQUFoQixHQUFzQixNQUF0QixFQUFOO0FBQ0EsTUFBSSxDQUFDSixNQUFNSyxLQUFOLENBQVlxQixRQUFaLENBQUwsRUFBNEIsT0FBTzFCLEtBQVAsQ0FMOEQsQ0FLakQ7O0FBRXpDO0FBQ0EsTUFBSSxDQUFDbUIsVUFBTCxFQUFpQjtBQUNmLFdBQU9uQixNQUFNa0MsUUFBTixDQUFlUixRQUFmLENBQVA7QUFDRDtBQUNEO0FBQ0EsU0FBTzFCLE1BQU1jLFFBQU4sQ0FBZVksUUFBZixFQUF5QixVQUFDSCxJQUFELEVBQVU7QUFDeEMsUUFBTUssTUFBTUwsS0FBS00sU0FBTCxDQUFlLFVBQUNDLENBQUQ7QUFBQSxhQUFPQSxFQUFFQyxHQUFGLENBQU0sSUFBTixNQUFnQm5CLElBQUlMLEVBQTNCO0FBQUEsS0FBZixDQUFaO0FBQ0EsUUFBSXFCLE9BQU8sSUFBWCxFQUFpQixPQUFPTCxJQUFQLENBRnVCLENBRVg7QUFDN0IsV0FBT0EsS0FBS04sTUFBTCxDQUFZVyxHQUFaLENBQVA7QUFDRCxHQUpNLENBQVA7QUFLRCxDQWpCRDs7QUFtQkE7QUFDTyxJQUFNTyxvQkFBTSxpQ0FBYztBQUMvQixtQkFBaUJwQyxZQURjO0FBRS9CLG1CQUFpQmlCLGNBRmM7QUFHL0IsbUJBQWlCTixhQUhjO0FBSS9CLHFCQUFtQlEsYUFKWTtBQUsvQix1QkFBcUJFLG9CQUxVO0FBTS9CLHVCQUFxQkssb0JBTlU7QUFPL0IsdUJBQXFCUTtBQVBVLENBQWQsRUFRaEJwQyxZQVJnQixDQUFaIiwiZmlsZSI6InJlZHVjZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFuZGxlQWN0aW9ucyB9IGZyb20gJ3JlZHV4LWFjdGlvbnMnXG5pbXBvcnQgeyBPcmRlcmVkTWFwLCBMaXN0LCBmcm9tSlMsIEl0ZXJhYmxlIH0gZnJvbSAnaW1tdXRhYmxlJ1xuXG5jb25zdCB0b0ltbXV0YWJsZSA9ICh2KSA9PlxuICBmcm9tSlModiwgKGtleSwgdmFsdWUpID0+XG4gICAgSXRlcmFibGUuaXNJbmRleGVkKHZhbHVlKSA/IHZhbHVlLnRvTGlzdCgpIDogdmFsdWUudG9PcmRlcmVkTWFwKClcbiAgKVxuXG5jb25zdCBpbml0aWFsU3RhdGUgPSBPcmRlcmVkTWFwKHtcbiAgc3Vic2V0czogT3JkZXJlZE1hcCgpXG59KVxuXG4vLyBzdWJzZXQgc3RhdGVcbmNvbnN0IGNyZWF0ZVN1YnNldCA9IChzdGF0ZSwgeyBwYXlsb2FkOiB7IHN1YnNldCwgZnJlc2ggfSB9KSA9PiB7XG4gIGlmICghc3Vic2V0KSByZXR1cm4gc3RhdGVcbiAgY29uc3QgcGF0aCA9IFsgJ3N1YnNldHMnLCBzdWJzZXQgXVxuICBpZiAoIWZyZXNoICYmIHN0YXRlLmhhc0luKHBhdGgpKSByZXR1cm4gc3RhdGVcbiAgY29uc3QgcmVjb3JkID0gT3JkZXJlZE1hcCh7XG4gICAgaWQ6IHN1YnNldCxcbiAgICBwZW5kaW5nOiB0cnVlXG4gIH0pXG4gIHJldHVybiBzdGF0ZS5zZXRJbihwYXRoLCByZWNvcmQpXG59XG5cbmNvbnN0IHNldFN1YnNldERhdGEgPSAoc3RhdGUsIHsgbWV0YTogeyBzdWJzZXQgfSwgcGF5bG9hZDogeyByYXcsIHRleHQgfSB9KSA9PiB7XG4gIGlmICghc3Vic2V0KSByZXR1cm4gc3RhdGVcbiAgY29uc3QgcGF0aCA9IFsgJ3N1YnNldHMnLCBzdWJzZXQgXVxuICBpZiAoIXN0YXRlLmhhc0luKHBhdGgpKSByZXR1cm4gc3RhdGUgLy8gc3Vic2V0IGRvZXNudCBleGlzdFxuICByZXR1cm4gc3RhdGUudXBkYXRlSW4ocGF0aCwgKHN1YnNldCkgPT5cbiAgICBzdWJzZXRcbiAgICAgIC5zZXQoJ2RhdGEnLCB0b0ltbXV0YWJsZShyYXcpKVxuICAgICAgLnNldCgndGV4dCcsIHRleHQpXG4gICAgICAuc2V0KCdwZW5kaW5nJywgZmFsc2UpXG4gICAgICAuc2V0KCdlcnJvcicsIG51bGwpXG4gIClcbn1cblxuY29uc3Qgc2V0U3Vic2V0RXJyb3IgPSAoc3RhdGUsIHsgbWV0YTogeyBzdWJzZXQgfSwgcGF5bG9hZCB9KSA9PiB7XG4gIGlmICghc3Vic2V0KSByZXR1cm4gc3RhdGVcbiAgY29uc3QgcGF0aCA9IFsgJ3N1YnNldHMnLCBzdWJzZXQgXVxuICBpZiAoIXN0YXRlLmhhc0luKHBhdGgpKSByZXR1cm4gc3RhdGUgLy8gc3Vic2V0IGRvZXNudCBleGlzdFxuICByZXR1cm4gc3RhdGUudXBkYXRlSW4ocGF0aCwgKHN1YnNldCkgPT5cbiAgICBzdWJzZXRcbiAgICAgIC5kZWxldGUoJ2RhdGEnKVxuICAgICAgLmRlbGV0ZSgndGV4dCcpXG4gICAgICAuc2V0KCdlcnJvcicsIHBheWxvYWQpXG4gICAgICAuc2V0KCdwZW5kaW5nJywgZmFsc2UpXG4gIClcbn1cblxuY29uc3Qgc2V0U3Vic2V0T3BlbiA9IChzdGF0ZSwgeyBtZXRhOiB7IHN1YnNldCwgY29sbGVjdGlvbiB9IH0pID0+IHtcbiAgaWYgKCFzdWJzZXQpIHJldHVybiBzdGF0ZVxuICBjb25zdCBwYXRoID0gWyAnc3Vic2V0cycsIHN1YnNldCBdXG4gIGlmICghc3RhdGUuaGFzSW4ocGF0aCkpIHJldHVybiBzdGF0ZSAvLyBzdWJzZXQgZG9lc250IGV4aXN0XG4gIHJldHVybiBzdGF0ZS51cGRhdGVJbihwYXRoLCAoc3Vic2V0KSA9PlxuICAgIHN1YnNldFxuICAgICAgLnNldCgncGVuZGluZycsIGZhbHNlKVxuICAgICAgLnNldCgnZGF0YScsIGNvbGxlY3Rpb24gPyBMaXN0KCkgOiBPcmRlcmVkTWFwKCkpXG4gIClcbn1cblxuY29uc3QgaW5zZXJ0U3Vic2V0RGF0YUl0ZW0gPSAoc3RhdGUsIHsgbWV0YTogeyBzdWJzZXQsIGNvbGxlY3Rpb24gfSwgcGF5bG9hZDogeyByYXcgfSB9KSA9PiB7XG4gIGlmICghc3Vic2V0KSByZXR1cm4gc3RhdGVcbiAgY29uc3QgcGF0aCA9IFsgJ3N1YnNldHMnLCBzdWJzZXQgXVxuICBpZiAoIXN0YXRlLmhhc0luKHBhdGgpKSByZXR1cm4gc3RhdGUgLy8gc3Vic2V0IGRvZXNudCBleGlzdFxuICBjb25zdCBuZXdEYXRhID0gdG9JbW11dGFibGUocmF3KVxuICByZXR1cm4gc3RhdGUudXBkYXRlSW4ocGF0aCwgKHN1YnNldCkgPT5cbiAgICBzdWJzZXRcbiAgICAgIC5zZXQoJ3BlbmRpbmcnLCBmYWxzZSlcbiAgICAgIC51cGRhdGUoJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAvLyBmaXJzdCBldmVudCwgaW5pdGlhbGl6ZSB0aGUgdmFsdWVcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCAmJiBjb2xsZWN0aW9uKSByZXR1cm4gTGlzdChbIG5ld0RhdGEgXSlcbiAgICAgICAgLy8gdmFsdWUgZXhpc3RzLCBlaXRoZXIgcHVzaCBvciByZXBsYWNlXG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uID8gZGF0YS5wdXNoKG5ld0RhdGEpIDogbmV3RGF0YVxuICAgICAgfSlcbiAgKVxufVxuXG5jb25zdCB1cGRhdGVTdWJzZXREYXRhSXRlbSA9IChzdGF0ZSwgeyBtZXRhOiB7IHN1YnNldCwgY29sbGVjdGlvbiB9LCBwYXlsb2FkOiB7IHJhdyB9IH0pID0+IHtcbiAgaWYgKCFzdWJzZXQpIHJldHVybiBzdGF0ZVxuICBjb25zdCBwYXRoID0gWyAnc3Vic2V0cycsIHN1YnNldCBdXG4gIGlmICghc3RhdGUuaGFzSW4ocGF0aCkpIHJldHVybiBzdGF0ZSAvLyBzdWJzZXQgZG9lc250IGV4aXN0XG4gIGNvbnN0IGRhdGFQYXRoID0gWyAuLi5wYXRoLCAnZGF0YScgXVxuICBpZiAoIXN0YXRlLmhhc0luKGRhdGFQYXRoKSkgcmV0dXJuIHN0YXRlIC8vIHN1YnNldCBoYXMgbm8gZGF0YSB0byB1cGRhdGVcbiAgY29uc3QgbmV4dCA9IHRvSW1tdXRhYmxlKHJhdy5uZXh0KVxuICByZXR1cm4gc3RhdGUudXBkYXRlSW4oZGF0YVBhdGgsIChkYXRhKSA9PiB7XG4gICAgLy8gbm90IGEgbGlzdCBpdGVtLCByZXBsYWNlIHdpdGggbmV3IHZhbHVlXG4gICAgaWYgKCFjb2xsZWN0aW9uKSByZXR1cm4gbmV4dFxuXG4gICAgLy8gbGlzdCBpdGVtLCBmaW5kIHRoZSBpbmRleCBhbmQgZG8gdGhlIHVwZGF0ZVxuICAgIGNvbnN0IGlkeCA9IGRhdGEuZmluZEluZGV4KChpKSA9PiBpLmdldCgnaWQnKSA9PT0gcmF3LnByZXYuaWQpXG4gICAgaWYgKGlkeCA9PSBudWxsKSByZXR1cm4gZGF0YSAvLyBub3Qgb3VyIGRhdGE/XG4gICAgcmV0dXJuIGRhdGEuc2V0KGlkeCwgbmV4dClcbiAgfSlcbn1cbmNvbnN0IGRlbGV0ZVN1YnNldERhdGFJdGVtID0gKHN0YXRlLCB7IG1ldGE6IHsgc3Vic2V0LCBjb2xsZWN0aW9uIH0sIHBheWxvYWQ6IHsgcmF3IH0gfSkgPT4ge1xuICBpZiAoIXN1YnNldCkgcmV0dXJuIHN0YXRlXG4gIGNvbnN0IHBhdGggPSBbICdzdWJzZXRzJywgc3Vic2V0IF1cbiAgaWYgKCFzdGF0ZS5oYXNJbihwYXRoKSkgcmV0dXJuIHN0YXRlIC8vIHN1YnNldCBkb2VzbnQgZXhpc3RcbiAgY29uc3QgZGF0YVBhdGggPSBbIC4uLnBhdGgsICdkYXRhJyBdXG4gIGlmICghc3RhdGUuaGFzSW4oZGF0YVBhdGgpKSByZXR1cm4gc3RhdGUgLy8gc3Vic2V0IGhhcyBubyBkYXRhIHRvIHVwZGF0ZVxuXG4gIC8vIG5vdCBhIGxpc3QsIGp1c3Qgd2lwZSB0aGUgdmFsXG4gIGlmICghY29sbGVjdGlvbikge1xuICAgIHJldHVybiBzdGF0ZS5yZW1vdmVJbihkYXRhUGF0aClcbiAgfVxuICAvLyBpdGVtIGluIGEgbGlzdCwgcmVtb3ZlIHRoZSBzcGVjaWZpYyBpdGVtXG4gIHJldHVybiBzdGF0ZS51cGRhdGVJbihkYXRhUGF0aCwgKGRhdGEpID0+IHtcbiAgICBjb25zdCBpZHggPSBkYXRhLmZpbmRJbmRleCgoaSkgPT4gaS5nZXQoJ2lkJykgPT09IHJhdy5pZClcbiAgICBpZiAoaWR4ID09IG51bGwpIHJldHVybiBkYXRhIC8vIG5vdCBvdXIgZGF0YT9cbiAgICByZXR1cm4gZGF0YS5kZWxldGUoaWR4KVxuICB9KVxufVxuXG4vLyBleHBvcnRlZCBhY3Rpb25zXG5leHBvcnQgY29uc3QgYXBpID0gaGFuZGxlQWN0aW9ucyh7XG4gICd0YWhvZS5yZXF1ZXN0JzogY3JlYXRlU3Vic2V0LFxuICAndGFob2UuZmFpbHVyZSc6IHNldFN1YnNldEVycm9yLFxuICAndGFob2Uuc3VjY2Vzcyc6IHNldFN1YnNldERhdGEsXG4gICd0YWhvZS50YWlsLm9wZW4nOiBzZXRTdWJzZXRPcGVuLFxuICAndGFob2UudGFpbC5pbnNlcnQnOiBpbnNlcnRTdWJzZXREYXRhSXRlbSxcbiAgJ3RhaG9lLnRhaWwudXBkYXRlJzogdXBkYXRlU3Vic2V0RGF0YUl0ZW0sXG4gICd0YWhvZS50YWlsLmRlbGV0ZSc6IGRlbGV0ZVN1YnNldERhdGFJdGVtXG59LCBpbml0aWFsU3RhdGUpXG4iXX0=