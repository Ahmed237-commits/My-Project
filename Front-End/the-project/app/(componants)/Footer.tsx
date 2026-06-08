import React from 'react';
import FooterContent from './FooterContent';
import { getServerSession } from 'next-auth';
import authOptions from '../lib/nextAuth';

const Footer = async () => {
  const session = await getServerSession(authOptions);
  return <FooterContent session={session} />;
};

export default Footer;
