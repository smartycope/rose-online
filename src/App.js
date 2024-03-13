import logo from './logo.svg';
import './App.css';
import { Box, Tab, Tabs, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
// import CommentIcon from '@mui/icons-material/Comment';


function CheckboxList({questions, setQuestion}) {
    const [checked, setChecked] = useState([0]);

    const handleToggle = (id) => () => {
        var copy = [...questions[id]]
        copy[2] = !copy[2]
        setQuestion(id, copy)
    };

    function submitText(e){
        if (e.code === "Enter"){
            e.preventDefault()
            setQuestion(-1, [e.target.value, 0, 1])
            e.target.value = ""
        }
    }

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {questions.map(([question, val, status], i) => {
                return (
                    <ListItem
                        key={i}
                        secondaryAction={
                            <IconButton edge="end">
                                {/* <CommentIcon /> */}
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton role={undefined} onClick={handleToggle(i)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    // 0 for not answered, 1 for answered, and 2 for skipped.
                                    checked={status == 1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText id={`checkbox-list-label-${i}`} primary={question} />
                        </ListItemButton>
                    </ListItem>
                )
            })}
            {/* Add the text area at the bottom */}
            <ListItem>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        // 0 for not answered, 1 for answered, and 2 for skipped.
                        checked={false}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <TextareaAutosize placeholder='New Factor' onKeyDown={submitText}/>
            </ListItem>
        </List>
    );
  }


function App() {
    const [mode, setMode] = useState('eval') // 'eval' or 'pref'
    const [tabIndex, setTabIndex] = useState(0);
    const [data, setData] = useState([])

    const getSetQuestion = key => (id, to) => {
        var copy = JSON.parse(JSON.stringify(data))
        if (id < 0)
            copy[key].push(to)
        else
            copy[key][id] = to
        setData(copy)
    }

    const tabNames = Array.from(Object.keys(data))
    const tabContents = tabNames.map(key =>
        <CheckboxList questions={data[key]} setQuestion={getSetQuestion(key)}/>
    )

    const tabs = tabNames.map((l) => <Tab label={l}/>)
    const contents = tabContents.map((con, i) => tabIndex === i && <Box>{con}</Box>)

    function loadData(e){
        if (e.target.files.length > 0){
            var reader = new FileReader()
            reader.onload = function(e) {
                setData(JSON.parse(e.target.result))
                // window.location.reload()
            }
            reader.readAsText(e.target.files[0]);
        } else {
            alert("Failed to load file")
            return
        }
    }

    function loadDefaults(_e){
        // Apparently this is how you do this
        fetch('defaults.pref')
            .then(response => response.text())
            .then((data) => {
                setData(JSON.parse(data))
            }
        )
    }

    // TODO: This is copied, unmodified
    function download(){
        // Create a Blob with the contents and set the MIME type
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

        // Create a link (anchor) element
        const link = document.createElement('a');

        // Set the download attribute and href with the Blob
        link.download = "NAME HERE" + ".json";
        link.href = URL.createObjectURL(blob);

        // Append the link to the body and trigger a click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
    }

    useEffect(() =>{
        // loadData('defaults.pref')
    }, [])

    return (
        <Box className="App">
            <Typography variant='h3'>Rose</Typography>
            <Tabs value={tabIndex} onChange={(e, idx) => setTabIndex(idx)} variant="scrollable" scrollButtons="auto">
                {tabs}
            </Tabs>
            <Box sx={{ padding: 2 }}> {contents} </Box>
            <Button onClick={loadDefaults}>Load Defaults</Button>
        </Box>
    );
}

export default App;
