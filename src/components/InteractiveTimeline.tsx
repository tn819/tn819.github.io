import React, { useState, useRef, useEffect } from 'react'

import { Box, Card, CardMedia, Typography } from '@mui/material'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined'

export interface TimelineItemData {
  id: string
  title: string
  detail: string
  imageUrl?: string
  iconType?: 'us-map' | 'books' | 'laptop'
  color?: string
}

interface InteractiveTimelineProps {
  items: TimelineItemData[]
}

const GenericIcon: React.FC<{ type: string; color?: string }> = ({
  type,
  color,
}) => {
  const iconColor = color || '#6366F1'

  const renderIcon = () => {
    switch (type) {
      case 'us-map':
        return (
          <MapOutlinedIcon
            sx={{ fontSize: 100, color: iconColor, opacity: 0.9 }}
          />
        )
      case 'books':
        return (
          <MenuBookOutlinedIcon
            sx={{ fontSize: 100, color: iconColor, opacity: 0.9 }}
          />
        )
      case 'laptop':
        return (
          <LaptopMacOutlinedIcon
            sx={{ fontSize: 100, color: iconColor, opacity: 0.9 }}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: { xs: 180, sm: 240 },
        background: `linear-gradient(135deg, ${iconColor}30 0%, ${iconColor}10 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 160,
          height: 160,
          border: `3px solid ${iconColor}`,
          borderRadius: '50%',
          opacity: 0.25,
        },
      }}
    >
      {renderIcon()}
    </Box>
  )
}

const TimelineCard: React.FC<{
  item: TimelineItemData
  index: number
}> = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2

      const distanceFromCenter = Math.abs(elementCenter - viewportCenter)
      const maxDistance = windowHeight / 2
      const centeredness = Math.max(0, 1 - distanceFromCenter / maxDistance)

      setProgress(centeredness)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scale = 0.95 + progress * 0.08
  const opacity = 0.5 + progress * 0.5
  const translateY = (1 - progress) * 30

  const hasVisual = item.imageUrl || item.iconType

  return (
    <Box
      ref={cardRef}
      sx={{
        py: 1.5,
        opacity: isVisible ? opacity : 0,
        transform: isVisible
          ? `scale(${scale}) translateY(${translateY}px)`
          : 'scale(0.9) translateY(50px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      <Card
        elevation={Math.round(progress * 8)}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: isEven ? 'row' : 'row-reverse' },
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid',
          borderColor: progress > 0.7 ? 'primary.main' : 'divider',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Visual Section */}
        {hasVisual && (
          <Box
            sx={{
              width: { xs: '100%', sm: '35%' },
              minHeight: { xs: 180, sm: 240 },
              position: 'relative',
              overflow: 'hidden',
              bgcolor: item.color ? `${item.color}20` : 'grey.100',
            }}
          >
            {item.imageUrl ? (
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            ) : item.iconType ? (
              <GenericIcon type={item.iconType} color={item.color} />
            ) : null}
          </Box>
        )}

        {/* Content Section */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: 'text.secondary',
              lineHeight: 1.7,
              fontSize: '0.95rem',
            }}
          >
            {item.detail}
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  items,
}) => {
  return (
    <Box sx={{ py: 2 }}>
      {items.map((item, index) => (
        <TimelineCard key={item.id} item={item} index={index} />
      ))}
    </Box>
  )
}

export default InteractiveTimeline
