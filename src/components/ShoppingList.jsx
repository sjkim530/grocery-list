import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShoppingListItem from './ShoppingListItem';

// const SERVER_URL = 'https://frozen-plateau-76692-65dc75c7b7d2.herokuapp.com';

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchShoppingList();
  }, [shoppingList]);

  const fetchShoppingList = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/shopping_list`);
      setShoppingList(response.data.shopping_list);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  };

  const updateItemStatus = async (item) => {
    const updatedItem = { ...item, found: !item.found };
    try {
      await axios.put(`${SERVER_URL}/update_item_status/${item.id}`, updatedItem);
      fetchShoppingList();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = inputValue.split(',').map(item => item.trim());
    try {
      await axios.post(`${SERVER_URL}/add_items`, { items });
      console.log("shoppingList", shoppingList)
      setInputValue('');
    } catch (error) {
      console.error('Error adding items:', error);
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`${SERVER_URL}/delete_item/${item.id}`);
      fetchShoppingList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleReset = async () => {
    try {
      await axios.delete(`${SERVER_URL}/reset_list`);
      fetchShoppingList();
    } catch (error) {
      console.error('Error resetting list:', error);
    }
  };

  return (
    <div className="container">
      <h1>장보기</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter items separated by commas"
          className="input-text"
        />
        <button type="submit" className="add-button">Add Items</button>
      </form>
      {shoppingList.length > 0 && (
        <button onClick={handleReset} className="reset-button">Reset List</button>
      )}
      <ul>
        {shoppingList.map(item => (
          <ShoppingListItem
            key={item.id}
            item={item}
            updateItemStatus={updateItemStatus}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;

