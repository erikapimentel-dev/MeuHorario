import {useState} from "react";


const Sidebar = ({items, onItemClick}) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index, item) => {
        setActiveIndex(index);
        onItemClick(item);
    };

    return (
        <div className="sidebar">
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={index === activeIndex ? 'active' : ''}
                        onClick={() => handleClick(index, item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;