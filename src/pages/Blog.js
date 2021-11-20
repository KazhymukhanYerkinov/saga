import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function Blog() {
  const dispatch = useDispatch();
  const blogData = useSelector(store => store.app.blog);
  console.log(blogData);

  return (
    <div>
      Blog
      <button onClick = {() => {
        dispatch({ type: 'LOAD_SOME_DATA' })
      }}>
        LOAD SOME DATA
      </button>
    </div>
  )
}