const ShoppingListItem = ({ item, updateItemStatus, handleDelete }) => {
  const handleClick = () => {
      updateItemStatus(item.item, !item.found);
  };

  const handleDeleteClick = () => {
    handleDelete(item);
};

return (
  <li>
      <span className="item-name">{item.item}</span> -
      <span className={item.found ? 'found-text' : 'not-found-text'}>
          {item.found ? ' Found' : ' Not Found'}
      </span>
      <button onClick={handleClick}>
          {item.found ? 'Mark as Not Found' : 'Mark as Found'}
      </button>
      <button onClick={handleDeleteClick} className="delete-button">Delete</button>
  </li>
);
};

export default ShoppingListItem;
