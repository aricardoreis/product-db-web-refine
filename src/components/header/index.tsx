import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useGetIdentity, useNotification } from '@refinedev/core';
import { HamburgerMenu, RefineThemedLayoutHeaderProps } from '@refinedev/mui';
import React, { useContext, useState } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import {
  CloseOutlined,
  QrCodeScannerOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';
import { BarcodeScanner } from '../barcode-scanner';
import { CircularProgress } from '@mui/material';
import { createSaleFromInvoice, createSaleFromHtml } from '../../services';

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { open } = useNotification();
  const { mode, setMode } = useContext(ColorModeContext);

  const { data: user } = useGetIdentity<IUser>();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const html = e.target?.result as string;
      createSaleFromHtml(html)
        .then((data) => {
          console.log('success creating invoice from html', data);
          open?.({
            type: 'success',
            message: 'Sale created successfully',
            key: 'sale-creation-success',
          });
        })
        .catch((error) => {
          console.log('error creating invoice from html', error);
          open?.({
            type: 'error',
            message: 'Error creating sale from HTML',
            key: 'sale-creation-error',
          });
        })
        .finally(() => {
          setIsLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        });
    };
    reader.readAsText(file);
  };

  const onDecodeResult = async (result: string) => {
    setMounted(false);

    // call service to create sale information
    setIsLoading(true);
    createSaleFromInvoice(result)
      .then((data) => {
        console.log('success creating invoice', data);
        open?.({
          type: 'success',
          message: 'Sale created successfully',
          key: 'sale-creation-success',
        });
      })
      .catch((error) => {
        console.log('error creating invoice', error);
        open?.({
          type: 'error',
          message: 'Error creating sale',
          key: 'sale-creation-error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AppBar position={sticky ? 'sticky' : 'relative'}>
      {mounted ? <BarcodeScanner onDecodeResult={onDecodeResult} /> : null}
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <HamburgerMenu />
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <input
              type="file"
              accept=".html,.htm"
              ref={fileInputRef}
              onChange={onFileUpload}
              style={{ display: 'none' }}
            />
            {!isLoading && (
              <IconButton
                color="inherit"
                onClick={() => fileInputRef.current?.click()}
                title="Upload NF-e HTML"
              >
                <UploadFileOutlined />
              </IconButton>
            )}
            <IconButton
              color="inherit"
              onClick={() => {
                setMounted(!mounted);
              }}
            >
              {mounted ? (
                <CloseOutlined />
              ) : (
                !isLoading && <QrCodeScannerOutlined />
              )}
            </IconButton>
            {isLoading ? <CircularProgress color="inherit" size={24} /> : null}

            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                {user?.name && (
                  <Typography
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'inline-block',
                      },
                    }}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                )}
                <Avatar src={user?.avatar} alt={user?.name} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
