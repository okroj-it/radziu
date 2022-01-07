import React, { useState, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardHeader, CardContent, createTheme, ThemeProvider, Typography } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import internal from 'stream';




const themeContent = createTheme({
components: {
    MuiCardHeader: {
        styleOverrides: {
            title: {
                fontFamily: [
                    'Licorice',
                ].join(','),
                fontSize: 44,
                textAlign: "center",
            },
            subheader: {
                fontFamily: [
                    'Merriweather'
                ].join(','),
                textAlign: "right",
            } 
        }
    },
    MuiCardContent: {
        styleOverrides: {
            root: {
                fontFamily: [
                    'Merriweather'
                ].join(','),
                fontSize: 12,
            }
        }
    }
}
});

let toggleFlag = false;

export default function Wishlist() {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const axios = require('axios').default;

    const formik = useFormik({
        initialValues: {
            text: "",
            author: ""
        },
        onSubmit: async () => {

            let body = JSON.stringify({
                content: formik.values.text,
                author: formik.values.author
            });
            try {
                await axios({
                  method: 'POST',
                  url: '/api/posts',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data: body
                });
              }
              catch(err){
                console.log(err)
              }
              finally {
                formik.resetForm();
                handleClose();
                toggleFlag = !toggleFlag;
                console.log(`Toggle Flag = ${toggleFlag}`);
                //formik.setSubmitting(false);
              }
        }
    });

    interface Entry {
        author: string;
        content: string;
        createdAt: string;
        id: number;
    }

    const [list, setList] = useState<Array<Entry>>();

    const data = useMemo(
        () => {
            const axios = require('axios').default;
            async function getData() {
                try {
                    let res = await axios({
                        method: 'GET',
                        url: '/api/posts',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    setList(res.data);
                }
                catch(err){
                    console.log(err)
                }
            }
            getData();
    }, [toggleFlag]);

    const teraz = new Date()

    const dateList = list?.map(item => new Date(item.createdAt).toLocaleDateString("pl-PL", { dateStyle: 'full'}));

    // const conditionalComponent = ({teraz, dateList}) => {
    //     return dateList.includes(teraz) ? (
    //         <CheckCircleIcon style={{ fill: 'green', fontSize: 128}}/>
    //     ) : (
    //         <CancelIcon style={{ fill: 'red', fontSize: 128}}/>
    //     )
    // }

    return (
        <ThemeProvider theme={themeContent}>
            <Grid 
                container
                spacing={1}
                direction={'column'}
                display={'flex'}>
                <Grid item xs={12} style={{textAlign: 'center'}}>
                    <Typography variant='h2' style={{ marginTop: 20, fontFamily: 'Merriweather'}}>
                        Czy Radosław Teklak dowiedział się już dziś jaki jest stary?
                    </Typography>
                    {dateList?.includes(teraz.toLocaleDateString("pl-PL", { dateStyle: 'full'})) ?
                        <CheckCircleIcon style={{ fill: 'green', fontSize: 128}}/> :
                        <CancelIcon style={{ fill: 'red', fontSize: 128}}/>
                    }
                </Grid>
                {list?.map(item => (
                    <Grid key={item.id}
                        item xs={12}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        <Card 
                            key={item.id}
                            variant='outlined'
                            style={{ backgroundColor: "#e0e0e0"}}>
                            <CardHeader
                                title={item.content}
                                subheader={item.author}/>
                            <CardContent
                                style={{textAlign: "right"}}>{
                                new Date(
                                    Date.parse(item.createdAt))
                                        .toLocaleString(
                                            "pl-PL", 
                                            { 
                                                dateStyle: 'full',
                                                timeStyle: 'medium'})}</CardContent>
                        </Card>
                    </Grid>
                ))}
                <Grid item xs={12} alignItems={'flex-end'} justifyContent={'flex-end'} justifySelf={'flex-end'} alignSelf={'flex-end'}>
                    <Button variant="contained" onClick={handleClickOpen}>
                        Dodaj wpis
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <form 
                        noValidate 
                        autoComplete="off"
                        onSubmit={formik.handleSubmit}
                        onReset={formik.handleReset}>
                        <Grid
                            container spacing={2}
                            direction={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}>
                            <Grid 
                                item xs={12}>

                                <TextField
                                    type='text'
                                    id='outlined-search'
                                    label="Co chcesz przekazać?"
                                    multiline
                                    name='text'
                                    placeholder='Pocisk'
                                    value={formik.values.text}
                                    onChange={formik.handleChange}/>
                            </Grid>
                            <Grid 
                                item xs={12}>

                                <TextField
                                    type='text'
                                    id='outlined-search'
                                    label="Od kogo?"
                                    name='author'
                                    placeholder='Autor'
                                    value={formik.values.author}
                                    onChange={formik.handleChange}/>

                            </Grid>
                            <Grid
                                item xs={12}>

                                <Button 
                                    variant="contained"
                                    type="submit"
                                    disabled={formik.isSubmitting ? true : false}
                                    endIcon={<SaveIcon />}>
                                    Zapisz
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    )
}
