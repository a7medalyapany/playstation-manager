import { Key, useEffect, useState } from 'react';

import { RootState } from '../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaystations, addPlaystation } from '../Redux/slices/playstationSlice';

import { PlaystationType } from '../types';
import { IPC } from '../../common/constants';

export const usePlaystations = () => {
  const dispatch = useDispatch();
  const playstations = useSelector((state: RootState) => state.playstation.playstations);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const cleanup = () => {
      // Remove listeners or do cleanup if needed
    };

    // Fetch data and set up listeners when the component mounts
    getAllPlaystations();

    return cleanup; // This function will be called when the component unmounts
  }, []);

  useEffect(() => {
    if (dataChanged) {
      getAllPlaystations();
      setDataChanged(false);
    }
  }, [dataChanged]);

  const getAllPlaystations = async () => {
    try {
      const playstations = await window.ipcRenderer.invoke(IPC.getAllPlaystations);
      dispatch(setPlaystations(playstations));
    } catch (error) {
      console.error('Error getting playstations:', error);
    }
  };

  const createPlaystation = async (PlayStationType: PlaystationType) => {
    try {
      const result = await window.ipcRenderer.invoke(IPC.createPlaystation, { PlayStationType });
      if (result.code === 1) {
        dispatch(addPlaystation(result.msg));
        setDataChanged(true);
      } else {
        console.error('Error creating PlayStation:', result.msg);
      }
    } catch (error) {
      console.error('Error creating PlayStation:', error);
    }
  };

  const reserveSession = async (PlayStationID: Key | number, PlayersNumber: number) => {
    try {
      const result = await window.ipcRenderer.invoke(IPC.Reserve , { PlayersNumber, PlayStationID})
      if (result.code === 1) {
        setDataChanged(true);
      } else {
        console.error('Error creating PlayStation:', result.msg);
      }
    } catch (error) {
      console.error('Error creating PlayStation:', error);
    }
  };

  const endSession = async (PlayStationID: Key | number) => {
    try {
      const result = await window.ipcRenderer.invoke(IPC.End , {PlayStationID})
      if (result.code === 1) {
        setDataChanged(true);
      } else {
        console.error('Error creating PlayStation:', result.msg);
      }
    } catch (error) {
      console.error('Error creating PlayStation:', error);
    }
  };

  return { playstations, getAllPlaystations, createPlaystation, reserveSession, endSession };
};
