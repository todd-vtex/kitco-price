import React from 'react'

const TestBlock = () => {
    console.log('*********** EXTREME DEBUG: TestBlock is rendering ***********')

    // Add an alert to force visibility
    React.useEffect(() => {
        alert('TestBlock is mounted - this confirms the block is loading')
    }, [])

    return (
        <div style={{
            padding: '20px',
            margin: '20px',
            background: 'red',
            border: '5px solid black',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px',
            textAlign: 'center',
            position: 'fixed',
            top: '100px',
            left: '100px',
            zIndex: 9999
        }}>
            <h1>TEST BLOCK</h1>
            <p>This is an extreme debug version</p>
            <p>If you see this, the block is loading</p>
        </div>
    )
}

// Standard schema definition
TestBlock.schema = {
    title: 'Test Block',
    description: 'Debug test block',
    type: 'object',
    properties: {}
}

export default TestBlock 