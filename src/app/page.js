'use client';

import { Box, Container, Heading, Text, VStack, Button, Input, Flex, SimpleGrid, Icon, Stack, useBreakpointValue, Badge } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function Home() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Randevu state'leri
  const [appointmentType, setAppointmentType] = useState('inPerson'); // inPerson veya online
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Scroll fonksiyonu
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form değişikliklerini takip eden fonksiyon
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Randevu tipi seçimi
  const handleAppointmentTypeSelect = (type) => {
    setAppointmentType(type);
  };

  // Hizmet seçimi
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  // Randevu onaylama
  const handleAppointmentSubmit = async () => {
    console.log('Form gönderimi başlatıldı');
    console.log('Form verileri:', {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      appointmentType,
      selectedService,
      appointmentDate,
      appointmentTime
    });

    let errorMessage = '';

    // Tüm alanların kontrolü
    if (!formData.fullName) {
      errorMessage = 'Lütfen adınızı ve soyadınızı girin';
    } else if (!formData.email) {
      errorMessage = 'Lütfen e-posta adresinizi girin';
    } else if (!formData.phone) {
      errorMessage = 'Lütfen telefon numaranızı girin';
    } else if (!selectedService) {
      errorMessage = 'Lütfen bir hizmet seçin';
    } else if (!appointmentDate) {
      errorMessage = 'Lütfen randevu tarihi seçin';
    } else if (!appointmentTime) {
      errorMessage = 'Lütfen randevu saati seçin';
    }

    if (errorMessage) {
      console.log('Validasyon hatası:', errorMessage);
      toast({
        title: 'Eksik Bilgi',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      // Form verilerini hazırla
      const formFields = {
        'entry.2112378272': formData.fullName,
        'entry.2106948244': formData.email,
        'entry.17109388': formData.phone.replace(/[^0-9]/g, ''),
        'entry.375456480': appointmentType === 'inPerson' ? 'Yüz yüze' : 'Online',
        'entry.1954964051': selectedService,
        'entry.2121097342': appointmentDate,
        'entry.210484833': appointmentTime,
        'entry.1014024249': formData.notes || ''
      };

      console.log('Form alanları hazırlandı:', formFields);

      // Form verilerini URL'e dönüştür
      const formParams = new URLSearchParams();
      Object.entries(formFields).forEach(([key, value]) => {
        formParams.append(key, value);
      });

      // Önce onay mesajı göster
      toast({
        title: 'Randevu Talebi Alınıyor',
        description: `${formData.fullName}, randevu talebiniz işleme alınıyor...`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      // Form verilerini gönder
      const response = await fetch(
        'https://docs.google.com/forms/d/1YiZNFjaHrmuRmMf8frvnfsyvKBIdndKohOKdEXsRkzo/formResponse',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formParams.toString(),
        }
      );

      // Başarılı mesajı göster
      toast({
        title: 'Randevu Talebiniz Alındı!',
        description: `Sayın ${formData.fullName}, randevu talebiniz başarıyla alınmıştır. 
                     24 saat içerisinde ${formData.email} adresinize detaylı bilgilendirme yapılacaktır.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Formu sıfırla
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        notes: ''
      });
      setSelectedService('');
      setAppointmentDate('');
      setAppointmentTime('');
      setAppointmentType('inPerson');

    } catch (error) {
      console.error('Form gönderim hatası:', error);
      toast({
        title: 'Hata',
        description: 'Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const calculateBMI = () => {
    if (!height || !weight) {
      toast({
        title: 'Hata',
        description: 'Lütfen boy ve kilo değerlerini giriniz.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    let status = '';
    if (bmiValue < 18.5) status = 'Zayıf';
    else if (bmiValue < 25) status = 'Normal';
    else if (bmiValue < 30) status = 'Kilolu';
    else status = 'Obez';

    toast({
      title: 'VKİ Hesaplandı',
      description: `Vücut Kitle İndeksiniz: ${bmiValue} (${status})`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box 
        as="header" 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={100} 
        bg="white" 
        shadow="sm"
        transition="all 0.2s"
        h="120px"
      >
        <Container maxW="container.xl">
          <Flex h="120px" align="center" justify="space-between">
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Flex align="center" cursor="pointer" onClick={() => scrollToSection('home')}>
                <Box w="160px">
                  <img 
                    src="/images/zisankosk.png" 
                    alt="Zişan Köşk Logo" 
                    style={{ 
                      width: '100%',
                      height: '100px',
                      objectFit: 'contain'
                    }} 
                  />
                </Box>
              </Flex>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              display={{ base: "none", md: "block" }}
            >
              <Stack direction="row" spacing={8} align="center">
                <Button variant="ghost" color="gray.600" onClick={() => scrollToSection('home')}>Ana Sayfa</Button>
                <Button variant="ghost" color="gray.600" onClick={() => scrollToSection('about')}>Hakkımda</Button>
                <Button variant="ghost" color="gray.600" onClick={() => scrollToSection('services')}>Hizmetler</Button>
                <Button variant="ghost" color="gray.600" onClick={() => scrollToSection('contact')}>İletişim</Button>
                <Button colorScheme="primary" leftIcon={<Icon>📅</Icon>} onClick={() => scrollToSection('appointment')}>
                  Randevu Al
                </Button>
              </Stack>
            </MotionBox>
            
            {/* Mobil Menü Butonu */}
            <Box display={{ base: "block", md: "none" }}>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('appointment')}
                colorScheme="primary"
                size="sm"
                leftIcon={<Icon>📅</Icon>}
              >
                Randevu Al
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        id="home"
        pt={24}
        bg="white"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative">
          <Box
            position="absolute"
            top="0"
            right="0"
            width="65%"
            height="100%"
            bg="primary.50"
            clipPath="polygon(100px 0, 100% 0, 100% 100%, 0 100%)"
            zIndex={0}
          />
          
          <MotionFlex
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            gap={{ base: 8, lg: 16 }}
            py={{ base: 10, lg: 20 }}
          >
            <Box flex={1} position="relative" zIndex={1}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Badge 
                  bg="primary.500"
                  color="white"
                  fontSize="sm"
                  px={3}
                  py={1}
                  mb={6}
                  borderRadius="full"
                >
                  DİYETİSYEN & BESLENME UZMANI
                </Badge>
                
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="bold"
                  color="gray.800"
                  lineHeight="1.2"
                  mb={6}
                >
                  Sağlıklı Beslenme ile{" "}
                  <Text 
                    as="span" 
                    color="primary.500"
                    position="relative"
                    _after={{
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      width: "100%",
                      height: "2px",
                      bg: "primary.500",
                      opacity: 0.3
                    }}
                  >
                    Yaşam Kalitenizi
                  </Text>{" "}
                  Artırın
                </Heading>

                <Text
                  fontSize={{ base: "md", lg: "lg" }}
                  color="gray.600"
                  mb={8}
                  maxW="xl"
                  lineHeight="tall"
                >
                  Uzman diyetisyen Zişan Köşk olarak, bilimsel ve güncel yaklaşımlarla 
                  kişiye özel beslenme programları hazırlıyor, sağlıklı yaşam yolculuğunuzda 
                  size rehberlik ediyorum.
                </Text>

                <Stack 
                  direction={{ base: "column", sm: "row" }} 
                  spacing={4}
                  mb={8}
                >
                  <Button
                    size="lg"
                    bg="primary.500"
                    color="white"
                    px={8}
                    _hover={{
                      bg: "primary.600",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }}
                    rounded="full"
                    onClick={() => scrollToSection('appointment')}
                  >
                    Randevu Alın
                  </Button>
                  <Button
                    size="lg"
                    bg="white"
                    color="primary.500"
                    px={8}
                    border="2px"
                    borderColor="primary.500"
                    _hover={{
                      bg: "primary.50",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }}
                    rounded="full"
                    onClick={() => scrollToSection('services')}
                  >
                    Hizmetlerimiz
                  </Button>
                </Stack>

                <SimpleGrid 
                  columns={{ base: 2, md: 3 }} 
                  spacing={{ base: 4, md: 8 }}
                  p={{ base: 4, md: 6 }}
                  bg="white"
                  rounded="2xl"
                  shadow="lg"
                  border="1px"
                  borderColor="gray.100"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="primary.500">4+</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">Yıllık Deneyim</Text>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="primary.500">500+</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">Mutlu Danışan</Text>
                  </VStack>
                  <VStack align="start" spacing={1} display={{ base: "none", md: "flex" }}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="primary.500">%95</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">Başarı Oranı</Text>
                  </VStack>
                </SimpleGrid>
              </MotionBox>
            </Box>

            <Box 
              flex={1} 
              position="relative" 
              zIndex={1}
              display={{ base: "none", lg: "block" }}
            >
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Box
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="2xl"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)",
                    zIndex: 1
                  }}
                >
                  <img
                    src="/images/hero.jpg"
                    alt="Diyetisyen Zişan Köşk"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      transform: "scale(1.02)",
                    }}
                  />
                </Box>

                <Box
                  position="absolute"
                  bottom="40px"
                  right="40px"
                  bg="white"
                  p={6}
                  borderRadius="2xl"
                  shadow="xl"
                  maxW="300px"
                  zIndex={2}
                >
                  <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
                    Online Danışmanlık
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Türkiye'nin her yerinden online beslenme danışmanlığı hizmeti veriyorum.
                  </Text>
                </Box>
              </MotionBox>
            </Box>
          </MotionFlex>
        </Container>

        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="10%"
          left="5%"
          width="300px"
          height="300px"
          bg="primary.50"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.6}
          zIndex={0}
        />
        <Box
          position="absolute"
          bottom="-10%"
          right="20%"
          width="200px"
          height="200px"
          bg="primary.50"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.4}
          zIndex={0}
        />
      </Box>

      {/* About Section */}
      <Container id="about" maxW="container.xl" py={20}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <VStack spacing={8} align="start">
            <Badge colorScheme="primary" fontSize="sm" px={3} py={1}>
              Hakkımda
            </Badge>
            <Heading as="h2" size="xl" color="gray.800">
              Profesyonel Deneyim ve Uzmanlık
            </Heading>
            <Text fontSize="lg" color="gray.600" lineHeight="tall">
              Merhaba, ben Zişan Köşk. 10 yıllık deneyimli bir diyetisyen olarak, sağlıklı beslenme ve yaşam tarzı konusunda danışanlarıma rehberlik ediyorum. Her bireyin kendine özgü ihtiyaçlarını anlayarak, kişiye özel beslenme programları oluşturuyorum. Amacım, danışanlarımın sadece kilo hedeflerine ulaşmalarını değil, aynı zamanda sağlıklı bir yaşam tarzını sürdürülebilir şekilde benimsemeleri için onlara destek olmaktır.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <Box p={6} bg="white" rounded="xl" shadow="md">
                <Text fontSize="4xl" fontWeight="bold" color="primary.500" mb={2}>
                  500+
                </Text>
                <Text color="gray.600">Mutlu Danışan</Text>
              </Box>
              <Box p={6} bg="white" rounded="xl" shadow="md">
                <Text fontSize="4xl" fontWeight="bold" color="primary.500" mb={2}>
                  4+
                </Text>
                <Text color="gray.600">Yıllık Deneyim</Text>
              </Box>
              <Box p={6} bg="white" rounded="xl" shadow="md">
                <Text fontSize="4xl" fontWeight="bold" color="primary.500" mb={2}>
                  %95
                </Text>
                <Text color="gray.600">Başarı Oranı</Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </Container>

      {/* Success Statistics Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VStack spacing={8} mb={16}>
              <Badge 
                bg="primary.500"
                color="white"
                fontSize="sm"
                px={3}
                py={1}
              >
                BAŞARI İSTATİSTİKLERİ
              </Badge>
              <Heading 
                fontSize={{ base: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                textAlign="center"
              >
                Rakamlarla Başarılarımız
              </Heading>
              <Text
                fontSize={{ base: "lg", xl: "xl" }}
                color="gray.600"
                maxW="xl"
                textAlign="center"
                lineHeight="tall"
              >
                Her danışanımızın başarısı bizim için önemli. İşte yıllar içinde elde ettiğimiz sonuçlar.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
              <Box
                bg="white"
                p={8}
                rounded="2xl"
                shadow="xl"
                border="1px"
                borderColor="gray.100"
              >
                <VStack spacing={8}>
                  <Heading size="md" color="gray.700">Ortalama Kilo Verme Başarısı</Heading>
                  <Box w="full" h="300px" position="relative">
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      w="25%"
                      h="60%"
                      bg="primary.100"
                      rounded="lg"
                    >
                      <VStack pt={4}>
                        <Text fontWeight="bold" color="primary.700">1. Ay</Text>
                        <Text fontSize="lg" fontWeight="bold" color="primary.700">4kg</Text>
                      </VStack>
                    </Box>
                    <Box
                      position="absolute"
                      bottom="0"
                      left="25%"
                      w="25%"
                      h="75%"
                      bg="primary.200"
                      rounded="lg"
                    >
                      <VStack pt={4}>
                        <Text fontWeight="bold" color="primary.700">2. Ay</Text>
                        <Text fontSize="lg" fontWeight="bold" color="primary.700">7kg</Text>
                      </VStack>
                    </Box>
                    <Box
                      position="absolute"
                      bottom="0"
                      left="50%"
                      w="25%"
                      h="85%"
                      bg="primary.300"
                      rounded="lg"
                    >
                      <VStack pt={4}>
                        <Text fontWeight="bold" color="primary.700">3. Ay</Text>
                        <Text fontSize="lg" fontWeight="bold" color="primary.700">10kg</Text>
                      </VStack>
                    </Box>
                    <Box
                      position="absolute"
                      bottom="0"
                      left="75%"
                      w="25%"
                      h="95%"
                      bg="primary.400"
                      rounded="lg"
                    >
                      <VStack pt={4}>
                        <Text fontWeight="bold" color="primary.700">4. Ay</Text>
                        <Text fontSize="lg" fontWeight="bold" color="primary.700">12kg</Text>
                      </VStack>
                    </Box>
                  </Box>
                </VStack>
              </Box>

              <Box
                bg="white"
                p={8}
                rounded="2xl"
                shadow="xl"
                border="1px"
                borderColor="gray.100"
              >
                <VStack spacing={8}>
                  <Heading size="md" color="gray.700">Danışan Memnuniyeti</Heading>
                  <Box w="full" h="300px" position="relative">
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      w="250px"
                      h="250px"
                      borderRadius="full"
                      border="30px solid"
                      borderColor="primary.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <VStack spacing={0}>
                        <Text fontSize="4xl" fontWeight="bold" color="primary.500">%98</Text>
                        <Text fontSize="sm" color="gray.600">Memnuniyet</Text>
                      </VStack>
                    </Box>
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      bg="green.50"
                      p={4}
                      rounded="xl"
                    >
                      <VStack spacing={1}>
                        <Text fontSize="sm" color="green.700">Tavsiye Oranı</Text>
                        <Text fontSize="xl" fontWeight="bold" color="green.700">%96</Text>
                      </VStack>
                    </Box>
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      bg="blue.50"
                      p={4}
                      rounded="xl"
                    >
                      <VStack spacing={1}>
                        <Text fontSize="sm" color="blue.700">Hedef Başarısı</Text>
                        <Text fontSize="xl" fontWeight="bold" color="blue.700">%92</Text>
                      </VStack>
                    </Box>
                  </Box>
                </VStack>
              </Box>
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VStack spacing={8} mb={16}>
              <Badge 
                bg="primary.500"
                color="white"
                fontSize="sm"
                px={3}
                py={1}
              >
                DANIŞAN YORUMLARI
              </Badge>
              <Heading 
                fontSize={{ base: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                textAlign="center"
              >
                Başarı Hikayeleri
              </Heading>
              <Text
                fontSize={{ base: "lg", xl: "xl" }}
                color="gray.600"
                maxW="xl"
                textAlign="center"
                lineHeight="tall"
              >
                Danışanlarımızın deneyimlerini ve başarı hikayelerini dinleyin.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {testimonials.map((testimonial, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box
                    bg="white"
                    p={8}
                    rounded="2xl"
                    shadow="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    position="relative"
                    _hover={{
                      transform: "translateY(-5px)",
                      shadow: "2xl",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <Box
                      position="absolute"
                      top={4}
                      right={4}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M21.3333 12H17.3333V8C17.3333 5.05448 19.7211 2.66667 22.6667 2.66667V4C20.4578 4 18.6667 5.79086 18.6667 8V13.3333H21.3333V12ZM13.3333 12H9.33333V8C9.33333 5.05448 11.7211 2.66667 14.6667 2.66667V4C12.4578 4 10.6667 5.79086 10.6667 8V13.3333H13.3333V12Z" fill="#22C55E" fillOpacity="0.2"/>
                      </svg>
                    </Box>
                    <VStack spacing={6} align="start">
                      <Text fontSize="lg" color="gray.700" fontStyle="italic">
                        "{testimonial.comment}"
                      </Text>
                      <Flex align="center" gap={4}>
                        <Box
                          w={12}
                          h={12}
                          rounded="full"
                          overflow="hidden"
                        >
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="gray.800">{testimonial.name}</Text>
                          <Text fontSize="sm" color="gray.500">{testimonial.achievement}</Text>
                        </Box>
                      </Flex>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" bg="white" py={20}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VStack spacing={8} mb={16}>
              <Badge colorScheme="primary" fontSize="sm" px={3} py={1}>
                Hizmetlerimiz
              </Badge>
              <Heading textAlign="center" size="xl" color="gray.800">
                Size Özel Beslenme Çözümleri
              </Heading>
              <Text fontSize="lg" color="gray.600" textAlign="center" maxW="container.md">
                Sağlıklı bir yaşam için ihtiyacınız olan tüm beslenme ve diyet hizmetlerini sunuyoruz.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {services.map((service, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Box
                    p={8}
                    bg="white"
                    rounded="2xl"
                    shadow="lg"
                    borderWidth="1px"
                    borderColor="gray.100"
                    position="relative"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      shadow: "2xl",
                      borderColor: "primary.200"
                    }}
                  >
                    <Box
                      position="absolute"
                      top="-20px"
                      right="-20px"
                      w="120px"
                      h="120px"
                      bg="primary.50"
                      borderRadius="full"
                      opacity={0.3}
                    />
                    <VStack spacing={4} align="start">
                      <Icon as={service.icon} w={12} h={12} color="primary.500" />
                      <Heading size="md" color="gray.800">
                        {service.title}
                      </Heading>
                      <Text color="gray.600">
                        {service.description}
                      </Text>
                      <Button 
                        variant="ghost" 
                        colorScheme="primary" 
                        size="sm"
                        rightIcon={<Icon>→</Icon>}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        Detaylı Bilgi
                      </Button>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      {/* BMI Calculator Section */}
      <Container maxW="container.xl" py={20}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <VStack spacing={8}>
            <Badge colorScheme="primary" fontSize="sm" px={3} py={1}>
              VKİ Hesaplayıcı
            </Badge>
            <Heading as="h2" size="xl" textAlign="center" color="gray.800">
              Vücut Kitle İndeksi Hesaplayıcı
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center" maxW="container.sm">
              VKİ, vücut ağırlığınızın boyunza göre normal olup olmadığını gösteren bir ölçüdür.
            </Text>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} w="full" alignItems="center">
              <Box>
                <VStack spacing={6} align="start">
                  <Box>
                    <Heading size="md" color="gray.700" mb={4}>VKİ Değerleri Ne Anlama Gelir?</Heading>
                    <SimpleGrid columns={1} spacing={4}>
                      <Box p={4} bg="blue.50" rounded="lg">
                        <Text fontWeight="bold" color="blue.700">18.5'in altı</Text>
                        <Text color="blue.600">Zayıf - Kilo almanız önerilir</Text>
                      </Box>
                      <Box p={4} bg="green.50" rounded="lg">
                        <Text fontWeight="bold" color="green.700">18.5 - 24.9</Text>
                        <Text color="green.600">Normal - İdeal kilonuz</Text>
                      </Box>
                      <Box p={4} bg="orange.50" rounded="lg">
                        <Text fontWeight="bold" color="orange.700">25 - 29.9</Text>
                        <Text color="orange.600">Kilolu - Kilo vermeniz önerilir</Text>
                      </Box>
                      <Box p={4} bg="red.50" rounded="lg">
                        <Text fontWeight="bold" color="red.700">30'un üzeri</Text>
                        <Text color="red.600">Obez - Sağlık riski</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                  <Box>
                    <Heading size="md" color="gray.700" mb={4}>Neden VKİ Önemlidir?</Heading>
                    <Text color="gray.600" lineHeight="tall">
                      VKİ değeriniz, sağlık riskleri hakkında önemli bilgiler verir. İdeal aralıkta olmayan VKİ değerleri; 
                      kalp hastalıkları, diyabet ve diğer sağlık sorunları riskini artırabilir. Profesyonel bir diyetisyen 
                      olarak, size özel beslenme programı ile ideal kilonuza ulaşmanıza yardımcı olabilirim.
                    </Text>
                  </Box>
                </VStack>
              </Box>
              <Box 
                w="full" 
                maxW="md" 
                p={8} 
                bg="white" 
                rounded="2xl" 
                shadow="xl"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel color="gray.700">Boy (cm)</FormLabel>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Örn: 170"
                      size="lg"
                      bg="gray.50"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'primary.500' }}
                      _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="gray.700">Kilo (kg)</FormLabel>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Örn: 70"
                      size="lg"
                      bg="gray.50"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'primary.500' }}
                      _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)' }}
                    />
                  </FormControl>
                  <Button 
                    colorScheme="primary" 
                    onClick={calculateBMI} 
                    w="full"
                    size="lg"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    Hesapla
                  </Button>
                  {bmi && (
                    <Box 
                      textAlign="center" 
                      p={6} 
                      bg="primary.50" 
                      rounded="xl" 
                      w="full"
                      border="2px"
                      borderColor="primary.100"
                    >
                      <Heading size="md" color="primary.700" mb={2}>
                        VKİ Sonucunuz
                      </Heading>
                      <Text fontSize="2xl" color="primary.700" fontWeight="bold" mb={2}>
                        {bmi}
                      </Text>
                      <Text color="primary.600">
                        {bmi < 18.5 ? 'Zayıf' : 
                         bmi < 25 ? 'Normal' :
                         bmi < 30 ? 'Kilolu' : 'Obez'}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </Container>

      {/* Appointment Section */}
      <Box 
        id="appointment" 
        bg="white" 
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          width="65%"
          height="100%"
          bg="primary.50"
          clipPath="polygon(100px 0, 100% 0, 100% 100%, 0 100%)"
          zIndex={0}
        />
        
        <Box
          position="absolute"
          top="10%"
          left="5%"
          width="300px"
          height="300px"
          bg="primary.50"
          borderRadius="full"
          filter="blur(60px)"
          opacity={0.6}
          zIndex={0}
        />
        
        <Box
          position="absolute"
          bottom="-10%"
          right="20%"
          width="200px"
          height="200px"
          bg="primary.50"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.4}
          zIndex={0}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <VStack spacing={8} mb={16}>
              <Badge 
                bg="primary.500"
                color="white"
                fontSize="sm"
                px={3}
                py={1}
              >
                RANDEVU
              </Badge>
              <Heading 
                fontSize={{ base: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                textAlign="center"
              >
                Online Randevu Alın
              </Heading>
              <Text
                fontSize={{ base: "lg", xl: "xl" }}
                color="gray.600"
                maxW="xl"
                textAlign="center"
                lineHeight="tall"
              >
                Sağlıklı yaşam yolculuğunuza başlamak için hemen randevu alın.
              </Text>
            </VStack>

            <Box
              bg="white"
              p={8}
              rounded="2xl"
              shadow="xl"
              borderWidth="1px"
              borderColor="gray.100"
            >
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
                <VStack spacing={8} align="stretch">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
                      1. Randevu Tipini Seçin
                    </Text>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                      <Box
                        p={6}
                        bg={appointmentType === 'inPerson' ? 'primary.50' : 'white'}
                        rounded="xl"
                        cursor="pointer"
                        borderWidth="2px"
                        borderColor={appointmentType === 'inPerson' ? 'primary.500' : 'gray.200'}
                        onClick={() => handleAppointmentTypeSelect('inPerson')}
                        _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                        transition="all 0.2s"
                      >
                        <VStack spacing={3}>
                          <Box
                            p={3}
                            bg="primary.100"
                            rounded="full"
                            color="primary.700"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </Box>
                          <Text fontWeight="bold" color="gray.800">Yüz Yüze Görüşme</Text>
                          <Text fontSize="sm" color="gray.600" textAlign="center">
                            Klinikte birebir görüşme
                          </Text>
                        </VStack>
                      </Box>
                      <Box
                        p={6}
                        bg={appointmentType === 'online' ? 'primary.50' : 'white'}
                        rounded="xl"
                        cursor="pointer"
                        borderWidth="2px"
                        borderColor={appointmentType === 'online' ? 'primary.500' : 'gray.200'}
                        onClick={() => handleAppointmentTypeSelect('online')}
                        _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                        transition="all 0.2s"
                      >
                        <VStack spacing={3}>
                          <Box
                            p={3}
                            bg="gray.100"
                            rounded="full"
                            color="gray.600"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Box>
                          <Text fontWeight="bold" color="gray.800">Online Görüşme</Text>
                          <Text fontSize="sm" color="gray.600" textAlign="center">
                            Video konferans ile görüşme
                          </Text>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
                      2. Hizmet Seçin
                    </Text>
                    <SimpleGrid columns={1} spacing={3}>
                      {services.map((service, index) => (
                        <Box
                          key={index}
                          p={4}
                          bg={selectedService === service.title ? 'primary.50' : 'white'}
                          rounded="xl"
                          cursor="pointer"
                          borderWidth="1px"
                          borderColor={selectedService === service.title ? 'primary.500' : 'gray.200'}
                          onClick={() => handleServiceSelect(service.title)}
                          _hover={{ bg: selectedService === service.title ? 'primary.50' : 'gray.50' }}
                          transition="all 0.2s"
                        >
                          <Flex align="center" gap={4}>
                            <Box
                              p={2}
                              bg="primary.50"
                              rounded="lg"
                              color="primary.500"
                            >
                              <Icon as={service.icon} w={6} h={6} />
                            </Box>
                            <Box>
                              <Text fontWeight="bold" color="gray.800">{service.title}</Text>
                              <Text fontSize="sm" color="gray.600">{service.description}</Text>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
                      3. Kişisel Bilgileriniz
                    </Text>
                    <VStack spacing={4}>
                      <FormControl isRequired isInvalid={!formData.fullName && formData.fullName !== ''}>
                        <FormLabel color="gray.700">Ad Soyad</FormLabel>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          placeholder="Adınız ve soyadınız"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "primary.500" }}
                          _focus={{ borderColor: "primary.500", ring: "1px", ringColor: "primary.500" }}
                        />
                        {!formData.fullName && formData.fullName !== '' && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            Ad soyad alanı zorunludur
                          </Text>
                        )}
                      </FormControl>
                      <FormControl isRequired isInvalid={!formData.email && formData.email !== ''}>
                        <FormLabel color="gray.700">E-posta</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="E-posta adresiniz"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "primary.500" }}
                          _focus={{ borderColor: "primary.500", ring: "1px", ringColor: "primary.500" }}
                        />
                        {!formData.email && formData.email !== '' && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            E-posta alanı zorunludur
                          </Text>
                        )}
                      </FormControl>
                      <FormControl isRequired isInvalid={!formData.phone && formData.phone !== ''}>
                        <FormLabel color="gray.700">Telefon</FormLabel>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="Telefon numaranız"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "primary.500" }}
                          _focus={{ borderColor: "primary.500", ring: "1px", ringColor: "primary.500" }}
                        />
                        {!formData.phone && formData.phone !== '' && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            Telefon alanı zorunludur
                          </Text>
                        )}
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.700">Not (Opsiyonel)</FormLabel>
                        <Input
                          name="notes"
                          as="textarea"
                          value={formData.notes}
                          onChange={handleFormChange}
                          placeholder="Eklemek istediğiniz notlar..."
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "primary.500" }}
                          _focus={{ borderColor: "primary.500", ring: "1px", ringColor: "primary.500" }}
                          minH="100px"
                          p={4}
                        />
                      </FormControl>
                    </VStack>
                  </Box>
                </VStack>

                <Box>
                  <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
                    4. Tarih ve Saat Seçin
                  </Text>
                  <Box
                    bg="gray.50"
                    p={6}
                    rounded="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Box
                      bg="white"
                      p={4}
                      rounded="xl"
                      shadow="sm"
                      mb={6}
                    >
                      <Text fontWeight="bold" color="gray.800" mb={4}>Tarih Seçin</Text>
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "primary.500" }}
                        _focus={{ borderColor: "primary.500", ring: "1px", ringColor: "primary.500" }}
                        mb={6}
                      />
                      <Text fontWeight="bold" color="gray.800" mb={4}>Müsait Saatler</Text>
                      <SimpleGrid columns={3} spacing={3}>
                        {[
                          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
                          '18:00'
                        ].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            colorScheme={appointmentTime === time ? 'primary' : 'gray'}
                            onClick={() => setAppointmentTime(time)}
                            _hover={{
                              bg: "primary.50",
                              transform: "translateY(-1px)"
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </SimpleGrid>
                    </Box>

                    <VStack spacing={4} align="stretch">
                      <Box bg="primary.50" p={4} rounded="lg">
                        <Text fontWeight="bold" color="primary.700" mb={2}>Seçilen Randevu</Text>
                        <Stack spacing={1}>
                          <Flex justify="space-between">
                            <Text color="gray.600">Tarih:</Text>
                            <Text color={!appointmentDate ? "red.500" : "gray.800"} fontWeight="medium">
                              {appointmentDate || 'Seçilmedi'}
                            </Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text color="gray.600">Saat:</Text>
                            <Text color={!appointmentTime ? "red.500" : "gray.800"} fontWeight="medium">
                              {appointmentTime || 'Seçilmedi'}
                            </Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text color="gray.600">Tür:</Text>
                            <Text color="gray.800" fontWeight="medium">
                              {appointmentType === 'inPerson' ? 'Yüz Yüze Görüşme' : 'Online Görüşme'}
                            </Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text color="gray.600">Hizmet:</Text>
                            <Text color={!selectedService ? "red.500" : "gray.800"} fontWeight="medium">
                              {selectedService || 'Seçilmedi'}
                            </Text>
                          </Flex>
                        </Stack>
                      </Box>

                      <Button
                        colorScheme="primary"
                        size="lg"
                        w="full"
                        h="60px"
                        onClick={handleAppointmentSubmit}
                        _hover={{
                          transform: "translateY(-2px)",
                          shadow: "lg",
                        }}
                      >
                        Randevuyu Onayla
                      </Button>

                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        Randevunuzu onayladıktan sonra detayları e-posta adresinize göndereceğiz.
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              </SimpleGrid>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" bg="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="start" w="full">
            <Badge colorScheme="primary" fontSize="sm" px={3} py={1}>
              İletişim
            </Badge>
            <Heading size="xl" color="gray.800">
              İletişime Geçin
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              <VStack spacing={8} align="start">
                <Box w="full">
                  <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={6}>
                    İletişim Bilgileri
                  </Text>
                  <VStack spacing={6} align="start" w="full">
                    <Flex 
                      p={6} 
                      bg="primary.500" 
                      rounded="xl" 
                      w="full"
                      align="center"
                      shadow="lg"
                      _hover={{ transform: "translateY(-2px)", filter: "brightness(110%)" }}
                      transition="all 0.2s"
                    >
                      <Box p={4} bg="white" rounded="xl" mr={4}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="white" opacity={0.9}>E-posta</Text>
                        <Text color="white" fontWeight="bold" fontSize="lg">info@zisankosk.com</Text>
                      </VStack>
                    </Flex>

                    <Flex 
                      p={6} 
                      bg="primary.500" 
                      rounded="xl" 
                      w="full"
                      align="center"
                      shadow="lg"
                      _hover={{ transform: "translateY(-2px)", filter: "brightness(110%)" }}
                      transition="all 0.2s"
                    >
                      <Box p={4} bg="white" rounded="xl" mr={4}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="white" opacity={0.9}>Adres</Text>
                        <Text color="white" fontWeight="bold" fontSize="lg">İstanbul, Türkiye</Text>
                      </VStack>
                    </Flex>
                  </VStack>
                </Box>

                <Box w="full">
                  <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={6}>
                    Sosyal Medya
                  </Text>
                  <SimpleGrid columns={3} spacing={4}>
                    <Button
                      as="a"
                      href="https://instagram.com/zisankosk"
                      target="_blank"
                      height="100px"
                      bg="linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
                      color="white"
                      rounded="xl"
                      shadow="md"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "lg",
                        filter: "brightness(110%)"
                      }}
                      transition="all 0.2s"
                    >
                      <VStack spacing={2}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                        <Text fontSize="sm">Instagram</Text>
                      </VStack>
                    </Button>
                    <Button
                      as="a"
                      href="https://facebook.com/zisankosk"
                      target="_blank"
                      height="100px"
                      bg="#1877F2"
                      color="white"
                      rounded="xl"
                      shadow="md"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "lg",
                        filter: "brightness(110%)"
                      }}
                      transition="all 0.2s"
                    >
                      <VStack spacing={2}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <Text fontSize="sm">Facebook</Text>
                      </VStack>
                    </Button>
                    <Button
                      as="a"
                      href="https://youtube.com/zisankosk"
                      target="_blank"
                      height="100px"
                      bg="#FF0000"
                      color="white"
                      rounded="xl"
                      shadow="md"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "lg",
                        filter: "brightness(110%)"
                      }}
                      transition="all 0.2s"
                    >
                      <VStack spacing={2}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <Text fontSize="sm">Youtube</Text>
                      </VStack>
                    </Button>
                  </SimpleGrid>
                </Box>
              </VStack>

              <Box
                bg="white"
                rounded="2xl"
                shadow="xl"
                overflow="hidden"
                position="relative"
                height="600px"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2718441828513!2d28.9783!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDEuOSJF!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

const services = [
  {
    title: 'Kişiye Özel Diyet Programı',
    description: 'Yaşam tarzınıza ve hedeflerinize uygun özel beslenme planları oluşturuyoruz.',
    icon: () => '🍎'
  },
  {
    title: 'Online Danışmanlık',
    description: 'Uzaktan takip ve sürekli destek ile her an yanınızdayız.',
    icon: () => '💻'
  },
  {
    title: 'Sporcu Beslenmesi',
    description: 'Performansınızı artıracak profesyonel beslenme programları hazırlıyoruz.',
    icon: () => '💪'
  }
];

const testimonials = [
  {
    name: "Ayşe Y.",
    achievement: "6 ayda 20 kilo verdi",
    comment: "Zişan Hanım sayesinde sadece kilo vermekle kalmadım, sağlıklı beslenme alışkanlıkları kazandım. Artık kendimi çok daha enerjik ve mutlu hissediyorum.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100"
  },
  {
    name: "Mehmet K.",
    achievement: "3 ayda hedefine ulaştı",
    comment: "Online danışmanlık hizmeti sayesinde yoğun iş tempomda bile programımı aksatmadan ilerleyebildim. Profesyonel yaklaşımı ve motivasyonu için çok teşekkürler.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"
  },
  {
    name: "Zeynep A.",
    achievement: "Sağlıklı yaşam yolculuğunda",
    comment: "Sadece bir diyetisyen değil, aynı zamanda bir yaşam koçu. Verdiği öneriler ve destekleyici yaklaşımı ile hayatımda pozitif değişiklikler yaşadım.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100"
  }
];
