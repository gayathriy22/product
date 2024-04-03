'use client';
import { UserInfoResponse } from "@/lib/google-oauth2";
import { FormEvent, useEffect, useState } from "react";
import { Box, Text, Link } from '@chakra-ui/react';
import { Progress, Button, Pagination, TabsProps, Tabs, Drawer, Space, Input, Form, Modal } from 'antd';
import { CheckOutlined, EditOutlined, EnterOutlined } from '@ant-design/icons';
import { Footer, Header } from "antd/es/layout/layout";
import Card from "antd/es/card/Card";
import banner from '/public/start_banner.png';
import moment from 'moment';

function Page() {
  const [user, setUser] = useState<UserInfoResponse | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const openEditModal = (task) => {
    console.log("Editing Task:", task);
    setEditingTask(task);
    setEditModalVisible(true);
  };
  
  const closeEditModal = () => {
    setEditingTask(null);
    setEditModalVisible(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch(`/api/me`).then(x => x.json()).then(setUser)
  }, [])

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const tasksData = await fetch('/api/tasks').then(res => res.json());
    setTasks(tasksData);
  };

  const onChange = (key: string) => {
    console.log(key);
    setActiveTab(key);
  };

  const handleAddTaskAction = () => {
    setOpen(true);
  };

  const moveTasktoLater = async (task) => {
    // Set the task date to tomorrow (aka later)
    const newDate = moment(task.date).add(1, 'day').toDate();

    const updatedTaskData = JSON.stringify({
      name: task.name,
      description: task.description || "",
      complete: false,
      date: newDate.toISOString(),
    });
    console.log("Updated Task Data:", updatedTaskData);
    
    try {
      const response = await fetch(`/api/tasks/${task.task_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updatedTaskData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update the task: ${errorData.error}`);
      }

      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const moveTasktoToday = async (task) => {
    // Set the task date to today's date
    const todayDate = moment().toDate();

    const updatedTaskData = JSON.stringify({
      name: task.name,
      description: task.description || "",
      complete: false,
      date: todayDate.toISOString(),
    });
    console.log("Updated Task Data:", updatedTaskData);
    
    try {
      const response = await fetch(`/api/tasks/${task.task_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updatedTaskData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update the task: ${errorData.error}`);
      }

      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const taskDetails = {
      name: formData.get('name'),
      date: moment().toDate().toISOString(),
      description: "Manually Added Task",
    };
    const body = JSON.stringify(taskDetails);
    console.log('Created task:', taskDetails);

    try {
      const response = await fetch('/api/tasks', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body 
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      setOpen(false);
      setTasks([...tasks, taskDetails]);
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTaskDetails = async (event: FormEvent, task) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const taskDetails = JSON.stringify({
      name: formData.get('name') || task.name,
      description: formData.get('description') || task.description || "edited task",
      complete: false,
      date: formData.get('date') || task.date,
    });
    console.log('Edited task:', taskDetails);
    
    try {
      const response = await fetch(`/api/tasks/${editingTask ? editingTask.task_id: "1"}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: taskDetails,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update the task: ${errorData.error}`);
      }
      setEditingTask(null);
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const renderTaskCard = () => {
    if (activeTab === '1') {
      const todayTasks = tasks.filter(task => moment(task.date).isSame(moment(), 'day'));

      // pagination stuff
      const pageSize = 1;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, todayTasks.length);
      const tasksForPage = todayTasks.slice(startIndex, endIndex);
  
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
      
      // actual content now
      if (todayTasks.length > 0) {
        return (
          <div>
            <Box style={{ boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)', backgroundColor: '#434343', padding: '32px', border: '3px solid #0788FF', borderRadius: '20px', width: '296px', height: '432px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px', position: 'relative',}}>
              {tasksForPage.map((task, index) => (
                <Card key={task.task_id} style={{ backgroundColor: '#434343', borderColor: '#434343', borderRadius: '20px', width: '286px', height: '426px', position: 'absolute', top: 0, left: 0, display: 'inline-block', flexDirection: 'column', alignItems: 'center'}}>
                  <Button type="primary"  onClick={() => moveTasktoLater(task)} style={{ width: '101px', height: '28px', borderRadius: '14px', fontSize: '14px', color: '#434343', background: '#B1DFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Poppins', marginLeft: '139px' }} icon={<EnterOutlined style={{color: '#262626'}}/>}>Later</Button>
                  <Text style={{ fontFamily: 'Poppins', fontSize: '32px', whiteSpace: 'nowrap', margin: '35px 0', color: '#FFF', textAlign: 'center' }}>{task.name}</Text>
                  <Button type="primary" style={{ width: '224px', height: '40px', padding: '10px 76px', color: '#000', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', background: '#B1DFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '200px', marginBottom: '12px', fontFamily: 'Poppins'}}>Complete</Button>
                </Card>
              ))}
            </Box>
            <div style={{ alignItems: 'center', marginBottom: '4px' }}>
              <Pagination
                simple
                defaultCurrent={currentPage}
                total={todayTasks.length}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            </div>
            <div style={{ alignItems: 'center' }}>
              <Progress percent={50} size={[300, 20]} showInfo={false} />
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <Card style={{ boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)', borderWidth: '3px', borderColor: '#0788FF', borderRadius: '20px', width: '296px', height: '432px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px',}}>
              <Text style={{fontSize: '48px', fontWeight: 'bolder'}}>+</Text>
              <Text>Create a task</Text>
            </Card>
            <div style = {{alignItems: 'center', marginBottom: '4px'}}>
              <Pagination simple defaultCurrent={1} total={1} />
            </div>
            <div style = {{alignItems: 'center'}}>
              <Progress percent={50} size={[300, 20]} showInfo={false} />
            </div>
          </div>
        );
      }
    } else if (activeTab === '2') {
      const laterTasks = tasks.filter(task => !moment(task.date).isSame(moment(), 'day'));
      // const laterTasks = tasks.filter(task => task.priority === 2);
      return (
        <Box bg="#262626" p="32px" borderRadius="14px" width="296px" height='521px' display='flex' flexDir='column' alignItems='center' overflowY='auto' whiteSpace='nowrap'>
          {laterTasks.map((task, index) => (
            <Card key={task.task_id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.60)', borderColor: '#262626', borderRadius: '20px', width: '256px', height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button type="primary" style={{ width: '28px', height: '28px', borderRadius: '6px', fontSize: '20px', marginRight: '8px', background: '#0788FF', display: 'flex', justifyContent: 'center', alignItems: 'center' }} icon={<CheckOutlined style={{color: '#262626'}}/>}></Button>
                <Button type="primary"  onClick={() => moveTasktoToday(task)} style={{ width: '28px', height: '28px', borderRadius: '6px', fontSize: '20px', background: '#B1DFFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }} icon={<EnterOutlined style={{color: '#262626'}}/>}></Button>
                <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins', fontSize: '12px', paddingRight: '4px', whiteSpace: 'nowrap'}}>{task.name}</Text>
                    <EditOutlined onClick={() => openEditModal(task)} style={{ paddingRight: '92px' }}/>
                    <Modal
                      title="Edit Task"
                      visible={editModalVisible}
                      onCancel={closeEditModal}
                      footer={null}
                    >
                      <form onSubmit={(event) => handleEditTaskDetails(event, editingTask)}>
                        <text>Task Name</text>
                        <Input name="name" defaultValue={editingTask ? editingTask.name : ''} />
                        <text>Date</text>
                        <Input name="date" defaultValue={editingTask ? editingTask.date : ''} />
                        <text>Description</text>
                        <Input name="description" defaultValue={editingTask ? editingTask.description : ''} />
                        <Button type="primary" htmlType="submit">Save</Button>
                      </form>
                    </Modal>
                  </div>
                  <hr style={{ width: '120px', marginTop: '4px', borderColor: '#FFF', paddingLeft: '92px', paddingRight: '16px'}} />
                </div>
              </div>
            </Card>
          ))}
        </Box>
      );
    }
    return null;
  };


  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Today',
    },
    {
      key: '2',
      label: 'Later',
    },
  ];
  

  return <div style={{ backgroundColor: '#FFF', fontFamily: 'Poppins'}}>

        <Header style={{ display: 'flex', alignItems: 'center' , borderRadius: '0px 0px 20px 20px', height: '176px', backgroundColor: '#D9D9D9', backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div>
                <Text style = {{fontSize: '20px', marginTop: '88px', marginBottom: '7.56px', color: 'black', fontWeight: 'bold'}}>Hello,</Text>
                <Text style = {{fontSize: '32px', marginTop: '-38px', marginBottom: '34.57px', color: 'black', fontWeight: 'bold'}}>{user?.given_name}</Text>
            </div>
        </Header>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: '-240px'}}>
                <Text style= {{fontSize: '24px', fontWeight: 'bolder', color: 'black'}}>Active Tasks</Text>
            </div>
            <div>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} size= 'large' /> 
            </div>
            <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {renderTaskCard()}
            </div>
            
        </div>
        <Footer style={{ textAlign: 'center', backgroundColor: '#434343', marginTop: '-260px'}}>
            <Button type="primary" onClick={() => handleAddTaskAction()} style={{ textAlign: 'center', width: '104px', height: '40px', borderRadius: '20px', fontSize: '20px'}}>+</Button>
            <Drawer
              placement="bottom"
              onClose={onClose}
              open={open}
            >
              {/* <Box style={{ backgroundColor: "#262626", padding: "32px", borderRadius: "14px", width: "104px", height: '8px' }}></Box> */}
              <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                <Input name="name" placeholder="Enter task name" style={{ marginBottom: '16px' }} />
                <Button type="primary" htmlType="submit" block>+</Button>
              </form>
            </Drawer>
        </Footer>
  </div>
}


export default Page;