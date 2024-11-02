"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';
import {IconDatabaseOff} from "@tabler/icons-react"
// const fetchTeachers = async () => {
//   const response = await fetch('/api/teachers');
//   return response.json();
// };

const TeacherTable = () => {
//   const { data, error, isLoading } = useQuery({queryKey:['teachers'],queryFn:()=> fetchTeachers()});

//   if (isLoading) return <CircularProgress />;
//   if (error) return <p>Error loading data</p>;

  return (
    <div className="">

    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {/* {data.map((teacher: { _id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; email: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; phone: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
              <TableRow key={teacher._id}>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.phone}</TableCell>
              </TableRow>
            ))} */}
            
            <TableRow className=' h-[30vh] '>
            <TableCell>
            </TableCell>
            <TableCell className="flex  h-[30vh] flex-col justify-center items-center font-bold">
             <IconDatabaseOff size={50}/>
            No Result
            </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </Paper>
            </div>
  );
};

export default TeacherTable;
