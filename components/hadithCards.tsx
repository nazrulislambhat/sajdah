import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';

export default function App() {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchIslamicImages();
  }, []);

  const fetchIslamicImages = async () => {
    try {
      const response = await fetch(
        'https://api.unsplash.com/photos/random?query=islamic&count=8&client_id=UM26ylfxkEFSGouPqOkDSL3eps9NPFHorVByglnKUYI'
      );
      const data = await response.json();
      const urls = data.map((item: any) => item.urls.regular);
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const list = [
    {
      title: 'Orange',
      price: '$5.50',
    },
    {
      title: 'Tangerine',
      price: '$3.00',
    },
    {
      title: 'Raspberry',
      price: '$10.00',
    },
    {
      title: 'Lemon',
      price: '$5.30',
    },
    {
      title: 'Avocado',
      price: '$15.70',
    },
    {
      title: 'Lemon 2',
      price: '$8.00',
    },
    {
      title: 'Banana',
      price: '$7.50',
    },
    {
      title: 'Watermelon',
      price: '$12.20',
    },
  ];

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 border-2 bg-WhiteSalahSync border-PrimarySalahSync px-16 py-24 rounded-lg">
      {list.map((item, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => console.log('item pressed')}
        >
          <CardBody className="overflow-visible p-0 bg-SecondarySalahSync">
            <Image
              shadow="none"
              radius="none"
              width="100%"
              alt={item.title}
              className="w-full object-cover h-[120px] max-w-[200px] "
              src={imageUrls[index % imageUrls.length]} // Using modulus to ensure the image URLs repeat if there are fewer images than list items
            />
          </CardBody>
          <CardFooter className="text-small justify-between bg-YellowSalahSync">
            <p className="text-xs font-bold py-2 text-PrimarySalahSync">
              {item.title}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
