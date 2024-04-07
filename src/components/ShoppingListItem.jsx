import React from 'react';

const ShoppingListItem = ({ item, updateItemStatus, handleDelete }) => {
  const handleCheckboxChange = () => {
    updateItemStatus(item);
  };

  const handleDeleteClick = () => {
    handleDelete(item);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={item.found}
        onChange={handleCheckboxChange}
      />
      <span className="item-name">{item.item}</span> -
      <span className={item.found ? 'found-text' : 'not-found-text'}>
        {item.found ? ' Found' : ' Not Found'}
      </span>
      <button onClick={handleDeleteClick} className="delete-button">Delete</button>
    </li>
  );
};

export default ShoppingListItem;
