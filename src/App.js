import React, { useEffect, useState } from 'react'
import Loading from './components/Loading'
import { styles } from './styles'
import PropTypes from 'prop-types'
function App ({ report }) {
  const [rpt, setRpt] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    rpt.on('buttonClicked', async (event) => {
      getFilters(event)
    })
  }, [rpt])

  useEffect(() => {
    if (report) {
      setRpt(report)
    }
  }, [report])

  const getPageWithSlicer = async () => {
    const pages = await rpt.getPages()
    // Retrieve the active page.
    const pageWithSlicer = pages.filter(function (page) {
      return page.isActive
    })[0]

    return pageWithSlicer
  }

  const getSlicers = async (visuals) => {
    const slicers = visuals.filter(function (visual) {
      return visual.type === 'slicer' && (visual.name === 'ed4c9327f1658bce3dfa' || visual.name === '9f7346bf4a20e1ce04f3')
    })

    return slicers
  }

  const getFilters = async (event) => {
    if (event.detail.id !== '900e7461ce1bbb3dea7f') {
      return null
    }
    setLoading(true)
    try {
      const pageWithSlicer = await getPageWithSlicer()
      const visuals = await pageWithSlicer.getVisuals()
      // Retrieve the target visual.
      const slicers = await getSlicers(visuals)
      const filters = {}
      await Promise.all(slicers.map(async (s) => {
        const state = await s.getSlicerState()

        if (state.filters.length > 0) {
          filters[state.filters[0].target.column] = state.filters[0].values[0]
        } else {
          filters[state.targets[0].column] = '*'
        }
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      await rpt.reload()
    }
  }

  if (loading) {
    return <div className='bisualfarma-layout'>
      <style>{styles}</style>
      <Loading />
    </div>
  }
  return null
}

App.propTypes = {
  report: PropTypes.object
}

export default App
