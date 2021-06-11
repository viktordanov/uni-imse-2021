import styles from '@/styles/components/personBadge.module.scss'
import React, { useEffect, useMemo } from 'react'
import c from 'classnames'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface PersonBadgeProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  name: string
  other?: string
  mode: 'full' | 'compact' | 'profile'
}

export const PersonBadge: React.FunctionComponent<PersonBadgeProps> = ({
  className,
  onClick,
  name,
  other,
  mode
}: PersonBadgeProps) => {
  const [color, setColor] = useLocalStorage<string | null>('color_' + name, null)

  useEffect(() => {
    if (color === null) {
      const h = 360 * Math.random()
      const s = 25 + 70 * Math.random()
      const l = 65 + 10 * Math.random()
      setColor(`${h} ${s} ${l}`)
    }
  }, [color])

  const [mainColor, secondaryColor] = useMemo(() => {
    if (color === null) return ['#c4c4c4', '#f4f4f4']
    const hsl = color.split(' ')
    return [`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`, `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.35)`]
  }, [color])

  const Badge = useMemo(() => {
    const letter = name.charAt(0).toUpperCase()
    const circleClass = mode === 'profile' ? styles.smallCircle : ''
    const circle = (
      <div className={c(styles.letterCircle, circleClass)} style={{ backgroundColor: mainColor }}>
        {letter}
      </div>
    )

    if (mode === 'profile') {
      return (
        <>
          <div className={styles.profileInfo}>
            <p>{name}</p>
            {other && <p>{other}</p>}
          </div>
          {circle}
        </>
      )
    }
    if (mode === 'compact') {
      return circle
    }
    if (mode === 'full') {
      const badge = (
        <div className={c(styles.badge)} style={{ backgroundColor: secondaryColor }}>
          <p>{name}</p>
          {other && <p>{other}</p>}
        </div>
      )
      return (
        <>
          {circle}
          {badge}
        </>
      )
    }
    return circle
  }, [name, mode, mainColor, secondaryColor])

  return (
    <div className={c(styles.personBadge, className)} onClick={onClick}>
      {Badge}
      <div className={'clearfix'}></div>
    </div>
  )
}
