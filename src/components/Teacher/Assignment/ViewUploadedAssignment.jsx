import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import  Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import http from '../../../../Axios/axios';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { delAssignment } from '../../../../Axios/assigAxios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Grid from "@mui/material/Grid";
import {RiArrowLeftSLine} from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { FcQuestions } from "react-icons/fc";
import { FcViewDetails} from "react-icons/fc";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FcAcceptDatabase } from "react-icons/fc";
import { FcPositiveDynamic } from "react-icons/fc";
import PropTypes from 'prop-types';
import QuestionList from './Components/QuestionList';
import TestcaseList from './Components/TestcaseList';
import Contents from './SubmitTable';
import NoSubmission from './NoSubmission';
import BeatLoader from "react-spinners/BeatLoader";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
 

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ViewUploadedTeacherAssig = ()=> {
    
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const Assignmentid = aid;
   
    const [assig,setAssig] = React.useState({})
    const [file,setFile] = React.useState()
    const [isAssignmentViewed, setAssignmentViewed] = React.useState(false);
    const [questions, setQuestions] = React.useState([]);
    const [testCases, settestCases] = React.useState([]);
    const [isTeacher, setIsTeacher] = React.useState(false);
    const [isAlreadySubmitted, setIsSubmitted] = React.useState(false);

    const [Assigdata,setAssigdata] = React.useState(false)

    const [submiteedAssigdata,setSubmiteedAssigdata] = React.useState([])

    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [noCourses, setNoCourses] = React.useState(false);


    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const getSubmission = async ()=>{
      try {
        const res = await http.get('/submit/isSubmitted')
        if(res.data.success){
          setIsSubmitted(true)
        }

      } catch (error) {
        console.log(error);
      }
    }


const getSubmittedAssignments = async ()=> {
      try {
        const res = await http.get(`/submit/AssignmentSubmissions/${Assignmentid}`)
        if(res.data.length == 0){
          setAssigdata(false)
        }
        else{
          setSubmiteedAssigdata(res.data)
          setAssigdata(true)
        }
      } catch (error) {
        console.log(error)
      }
}

useEffect(() => {
  setLoading(true);
  http.get(`/assignment/viewAssignment/${Assignmentid}`)
    .then((response) => {
      // setLoading(true);
      setAssig(response.data.Viewassignment);
      // setLoading(false);
      setFile(response.data.PdfDataUrl);
      setQuestions(response.data.Viewquestions);
      settestCases(response.data.TestCase)
      
      response.data.TestCase.map((t) => {
        console.log(t)
      })

      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false); // Make sure to set loading to false in case of an error too
    });

    const userJSON = localStorage.getItem('User')
    const user = JSON.parse(userJSON);
    if(user.user?.role == 'Teacher'){
      setIsTeacher(true)
      getSubmittedAssignments()
    }
    else{
      if(user.userID?.role == 'Student'){
       getSubmission()
       

        setIsTeacher(false)
        }
      
    }
}, [Assignmentid]); 
    
  const handleAssignmentOpen = () => setAssignmentViewed(true);

  const handleAssignmentClose = () => setAssignmentViewed(false);

    const handleDeleteClick = (id) => () => {
        delAssignment(id, cid)
          .then(() => {
            const url = `/Teacher/ViewUploadedAssigList/${cid}`;
            navigate(url);
          })
          .catch((error) => {
            // Handle error if needed
            console.error(error);
          });
      };
      
    //useeffect m usestate ayegi
    //1 use state to check role and render screen acc to it
    const theme = useTheme()

    // const[AssigNo,setAssigNo] = React.useState('')
    // const[Description,setDescription] = React.useState('assig.description')
    // const[uploadDate,setuploadDate] = React.useState('3/10/2023')
    // const[dueDate,setdueDate] = React.useState('7/10/2023')
    // const[marks,setMarks] = React.useState('10')
    // const[file,setFile] = React.useState('file')
    const uploadDate = assig.uploadDate;
    const udate = new Date(uploadDate);

    const formattedUploadDate = `${udate.getDate()}-${udate.getMonth() + 1}-${udate.getFullYear()}`;

    const DueDate = assig.dueDate;
    const ddate = new Date(DueDate);

    const formattedDueDate = `${ddate.getDate()}-${ddate.getMonth() + 1}-${ddate.getFullYear()}`;

    function formatTimeToAMPM(hours, minutes) {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${period}`;
    }
    
    
    const time = assig?.dueTime ? new Date(assig.dueTime) : new Date();
    

const formattedTime = formatTimeToAMPM(time.getHours(), time.getMinutes());

    const handleDownload = () => {
        var downloadURL = file;
        const link = document.createElement('a');
        link.href = downloadURL; 
        link.download = 'assignment.pdf';
        link.click();
      };
      

    return(
     <>
      <Box sx={{display:'flex', flexDirection:'row', marginTop:2}}>
        <Tabs color="secondary" sx={{color:theme.palette.secondary.main}} value={value} onChange={handleChange} aria-label="icon label tabs example">
          <Tab icon={<FcViewDetails fontSize={25} />} label="Assignment Details" sx={{color:theme.palette.secondary.main, marginRight:7}}/>
          <Tab icon={<FcQuestions fontSize={25} />} label="Questions" color='secondary' sx={{color:theme.palette.secondary.main, marginRight:7}} />
          <Tab icon={<FcAcceptDatabase fontSize={25}/>} label="Submissions" color='secondary' sx={{color:theme.palette.secondary.main, marginRight:7}} />
          <Tab icon={<FcPositiveDynamic fontSize={25}/>} label="Test Cases" sx={{color:theme.palette.secondary.main}}/>
        </Tabs>
      </Box>
      <hr style={{borderTop: '0.1px solid 	#F0F0F0', width:'99%', margin:0}}></hr>

      <CustomTabPanel value={value} index={0}>
      {loading ? (
          <Box
          sx={{
            backgroundColor: "white",
            height:'80vh',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BeatLoader color="#1665b5"
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : ( 
        <Box>
          <Grid container spacing={2}>
          <Grid xs={12} md={12} lg={12}>
            <Box sx={{display:'flex', flexDirection:'row',justifyContent:'space-between', marginTop:3,marginLeft:2}}>
              <Box sx={{display:'flex', flexDirection:'row', cursor:'pointer'}}>
                <RiArrowLeftSLine fontSize={20} style={{color:theme.palette.secondary.main}}/>
                <p style={{marginTop:0, marginLeft:8, fontSize:16, color:theme.palette.secondary.main, fontWeight:'bold'}}>Back</p>
              </Box>
              <Box>
                {
                isTeacher && (
                  <>
                  <Button 
                    variant="contained" color="secondary" 
                      sx={{fontSize: 16, paddingTop:1,paddingBottom:1,paddingLeft:2,paddingRight:2, marginRight:2}}
                      startIcon={<TbEdit/>}
                      onClick={() => navigate(`/Teacher/AddAssignment/${cid}`
                      , {
                          // state: { course: courses.find(c =>  c._id === id) },
                          state: { assig: assig },
                        })
                  }
                      >
                      Edit
                  </Button>
                  <Button 
                    variant="outlined" color="error" 
                    startIcon={<RiDeleteBin5Line/>}
                    sx={{fontSize: 16, padding:1, marginRight:3}}
                      onClick={handleDeleteClick(assig._id)}
                      >
                      Delete
                  </Button>
                  </>
                )
                  }
              </Box>
            </Box>
          </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={12} md={12} lg={7}>
              <Box sx={{marginTop:3, marginLeft:2}}>
              <Box>
              <Box sx={{display:'flex', flexDirection:'row',justifyContent:'space-between'}}>
                  <Box> 
                      <p style={{fontWeight:'bolder', margin:0, fontSize:30}}>Assignment : {assig.assignmentNumber}</p> 
                      <p style={{ marginTop:6, fontSize:16, color:'grey'}}>Due at {formattedDueDate}</p> 
                      <p style={{ marginTop: 6, fontSize: 16, color: "red", }}>
                          ({formattedTime}) 
                        </p>
                  </Box>
                  <Box> 
                      <p style={{fontWeight:'bolder', margin:0, fontSize:18}}>Marks</p> 
                      <p style={{ marginTop:6, fontSize:16, color:'grey'}}>Total Points: {assig.totalMarks}</p> 
                  </Box>
              </Box>
              
            </Box>
            <Box sx={{marginTop:2}}>
                <p style={{fontWeight:'bold', fontSize:18, margin:0}}>Instructions</p>
                <p>{assig.description}</p>
            </Box>
            
            <Box sx={{marginTop:4}}>
                <p style={{fontSize:18}}> <b>File Extension: </b> {assig.format}</p>
            </Box>
            <Box sx={{marginTop:2}}>
                <p style={{fontSize:18}}> <b>Assignment File </b></p>
            </Box>
          
            <Box sx={{display:'flex',flexDirection:'row',marginTop:'1%'}} >
              <Box sx ={{width:'60%',}}>
                <Link style={{textDecoration:'none'}} onClick={handleAssignmentOpen}> 
                    <Box 
                        sx={{border:1,padding:2,flexGrow:1,borderRight:0,borderRadius:1, color:theme.palette.secondary.main}}>View Assignment
                    </Box>
                </Link>
            <Modal
                    open={isAssignmentViewed}
                    onClose={handleAssignmentClose}
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                        timeout: 500,
                        },
                    }}
                >
                <Fade in={isAssignmentViewed}>
                    <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '90%',
                        maxWidth: '800px',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'white',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        borderRadius: '25px',
                    }}
                    >
                    <Box sx={{display:'flex' , flexDirection: 'row' , justifyContent:'space-between'}}>
                    <Typography variant='h4' sx={{fontWeight:'bold', paddingBottom:1,}}>Assignment : {assig.assignmentNumber}</Typography>
                <Box sx={{marginY:'1%'}}>
                <Typography variant='p' sx={{color:theme.palette.secondary.main}}> <b>Total Marks: </b> {assig.totalMarks}</Typography>
            </Box>
                    </Box>
                    {questions.map((question , index) => (
                        <Box sx={{display:'flex' , flexDirection: 'row' , justifyContent:'space-between'}}>
                            <Typography  sx={{my:'1%'}}>
                            <b> Question {index + 1} </b>
                            {question.questionDescription}
                            </Typography>
                            <Typography  sx={{my:'1%', color:theme.palette.secondary.main }}>
                            {`( ${question.questionTotalMarks} )`}
                            
                            </Typography>
                        </Box>
                    ))}
                    </Box>
                </Fade>
                </Modal>

            </Box>
            <Box sx={{width:'30%'}}>
            <Button
                variant="contained" color="secondary" 
                sx={{  height:'100%', 
                  
                  }}
                onClick={handleDownload}
              
            >
                {<FileDownloadOutlinedIcon />}
            </Button>
            </Box>
            </Box>
            
            
              </Box>
            </Grid>
          </Grid>
        </Box>
         )}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <QuestionList  questions = {questions}/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        {Assigdata ? <Contents Assignments = {submiteedAssigdata} id = {Assignmentid}   /> : <NoSubmission /> }
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        {
          testCases.length > 0 && 
           testCases.map((t, index) => (
            <>
                <p>
                  <span style={{fontWeight:'bold', fontSize:20}}>Question-{index+1}: </span> <span style={{fontStyle:'italic', fontSize:20}}>{t._doc.questionDescription}</span>
                </p>
                <TestcaseList testCases = {t.testCases}  />
              </>
           )

           )
        }
      </CustomTabPanel>
     </>
    )
}
export default ViewUploadedTeacherAssig