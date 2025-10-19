from temporalio import workflow

async def send_create_node(parent_workflow_id, user_id, workflow_id, parent_node_id, details, signal_name):
    if not parent_workflow_id:
        workflow.logger.error("[AUDIO-WORKER] Parent workflow ID not set — cannot create node")
        return
    data = {
        'user_id': user_id,
        'workflow_id': workflow_id,
        'parent_node_id': parent_node_id,
        'details': details
    }
    await workflow.signal_external_workflow(
        workflow_id=parent_workflow_id,
        signal=signal_name,
        arg=data
    )


async def send_update_node(parent_workflow_id, node_id, status, details, signal_name):
    if not parent_workflow_id:
        workflow.logger.error("[AUDIO-WORKER] Parent workflow ID not set — cannot update node")
        return
    data = {
        'node_id': node_id,
        'status': status,
        'details': details
    }
    await workflow.signal_external_workflow(
        workflow_id=parent_workflow_id,
        signal=signal_name,
        arg=data
    )
