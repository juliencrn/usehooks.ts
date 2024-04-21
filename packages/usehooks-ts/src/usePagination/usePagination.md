The `usePagination` hook abstracts the pagination of an array and it helps to paginate the data in the frontend applications when the APIs doesn't provide this functionality. This hook takes an `array` as an input, `page size` as an optional parameter and returns the current page and different functions to navigate between the pages.

**Note**: The hook will reset the pagination when the input array or it's reference changes.
