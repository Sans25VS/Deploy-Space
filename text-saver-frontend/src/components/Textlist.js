import React from 'react';
import { List, ListItem, ListItemText, Link } from '@mui/material';

const TextList = ({ texts }) => {
  return (
    <List>
      {texts.map((text, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={text.text}
            secondary={text.url && <Link href={text.url} target="_blank" rel="noopener">{text.url}</Link>}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TextList;
